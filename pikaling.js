const result = require('dotenv').config();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
	socketPath: process.env.DB_SOCKETPATH
//     host: process.env.DB_HOST, 
//     user: process.env.DB_USER, 
//     password: process.env.DB_PASSWORD,
//     ssl: process.env.DB_SSL,
//     database: process.env.DB_DATABASE,
//     connectionLimit: process.env.DB_CONNECTIONLIMIT
});

var solr = require('solr-client');
var client = solr.createClient({
	host: 'galacto.library.nashville.org',
	port: '8180',
	core: 'grouped',
});

var query = client.createQuery()
	.q('*:*')
	.rows(0)
	.set('stats=true')
	.set('stats.field=language')
	.set('stats.calcdistinct=true')
;

//console.log(client);
//console.log(query);

client.search(query,function(err,obj){
	if(err){
   		console.log(err);
	}else{
		var s = obj.stats.stats_fields.language.distinctValues;
		var t = ['English', 'None', 'Undetermined', 'Unknown'];
		t.forEach(function (u, v) {
			w = s.indexOf(u);
			if (w > -1) {
				s.splice(w, 1);
			}
		});
		s = '/(' + s.join('|') + ')/';
		var query = client.createQuery()
			.q('*:*')
			//.matchFilter('language','/(English|None|Undetermined|Unknown)/')
			//.matchFilter('language','/(Afrikaans|Afro-Asiatic|Albanian|Amharic|Ancient+Greek|Arabic|Aramaic|Armenian|Azerbaijani|Bambara|Basque|Bengali|Bosnian|Breton|Bulgarian|Burmese|Catalan|Catalan%3B+Valencian|Celtic|Central+Khmer|Chamorro|Chinese|Choctaw|Church+Slavic|Chuukese|Cree|Creole|Creoles|Croatian|Czech|Danish|Dutch|Dyula|Efik|Elamite|Estonian|Ewe|Filipino|Finnish|French|Fulah|Georgian|German|Germanic|Greek|Gujarati|Haitian|Hausa|Hawaiian|Hebrew|Hindi|Hungarian|Icelandic|Indonesian|Inuktitut|Irish|Italian|Japanese|Javanese|Kannada|Karen|Kazakh|Kinyarwanda|Kirghiz|Korean|Kurdish|Latin|Latvian|Lingala|Lithuanian|Macedonian|Malay|Malayalam|Mandingo|Maori|Marathi|Middle+English|Mongolian|Mossi|Multiple|Navajo|Nepal+Bhasa|Nepali|Niger-Kordofanian|North+American+Indian|Norwegian|Nubian|Ojibwa|Old+English|Old+French|Pampanga|Panjabi|Pedi|Persian|Polish|Portuguese|Pushto|Romanian|Romany|Russian|Samoan|Sanskrit|Sign+Language|Slave|Slovak|Slovenian|Somali|Songhai|Spanish|Swahili|Swedish|Swiss+German|Tagalog|Tamashek|Tamil|Telugu|Thai|Tibetan|Tonga|Turkish|Ukrainian|Urdu|Uzbek|Vietnamese|Welsh|Wolof|Xhosa|Yiddish|Yoruba|Zande|Zaza|Zulu)/')
			.matchFilter('language','English')
			.matchFilter('language',s)
			.matchFilter('NOT+grouping_category','music')
			.fl('id,title,record_details')
			.rows(10000);

		client.search(query,function(err,obj){
			if(err){
			   	console.log(err);
			}else{
				obj.response.docs.forEach(function (g, h) {
					// test record_details for more than one bib AND at least one bib with English
					if (g.record_details.length > 1 && g.record_details.findIndex(b => b.includes('English')) != -1) {
						const gid = g.id;
						const title = g.title.trim().replace(/["']/g,'').normalize('NFKC');
						g.record_details.forEach(function (b, c) {
							const bib = b.split("|");
							const [bsource, bid] = bib[0].split(":",2);
							const blang = bib[4];
							if (blang != "English") {
								const sql = 'INSERT INTO vufind.nongrouped_records (source,recordId,notes) '
									+ 'VALUES ("' + bsource + '","' + bid + '","LANGUAGE: ' + title + ' [' + blang + ']") '
									+ 'ON DUPLICATE KEY UPDATE '
									+ 'source = "' + bsource + '", '
									+ 'recordId = "' + bid + '", '
									+ 'notes = "LANGUAGE: ' + title + ' [' + blang + ']";';
								asyncMariaDBInsert(sql);
							}
						})
					}
				})
			}
		});
	}
});

async function asyncMariaDBInsert(sql) {
  let conn;
  try {
	conn = await pool.getConnection();
	const result = await conn.query(sql, [1, "mariadb"]);
	console.log(res); 

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}
