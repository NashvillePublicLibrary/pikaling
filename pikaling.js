var SolrNode = require('solr-node');
var client = new SolrNode({
	host: 'galacto.library.nashville.org',
	port: '8180',
	core: 'grouped',
	protocol: 'http'
});

var Datastore = require('nedb');
var db = new Datastore();

var objQuery = client.query()
	.q('*:*')
/*
	.fq({[
		'language: English',
		'language: Spanish'
//		language: '/(English|None|Undetermined|Unknown)/',
//		language: '/(Afrikaans|Afro-Asiatic|Albanian|Amharic|Ancient+Greek|Arabic|Aramaic|Armenian|Azerbaijani|Bambara|Basque|Bengali|Bosnian|Breton|Bulgarian|Burmese|Catalan|Catalan%3B+Valencian|Celtic|Central+Khmer|Chamorro|Chinese|Choctaw|Church+Slavic|Chuukese|Cree|Creole|Creoles|Croatian|Czech|Danish|Dutch|Dyula|Efik|Elamite|Estonian|Ewe|Filipino|Finnish|French|Fulah|Georgian|German|Germanic|Greek|Gujarati|Haitian|Hausa|Hawaiian|Hebrew|Hindi|Hungarian|Icelandic|Indonesian|Inuktitut|Irish|Italian|Japanese|Javanese|Kannada|Karen|Kazakh|Kinyarwanda|Kirghiz|Korean|Kurdish|Latin|Latvian|Lingala|Lithuanian|Macedonian|Malay|Malayalam|Mandingo|Maori|Marathi|Middle+English|Mongolian|Mossi|Multiple|Navajo|Nepal+Bhasa|Nepali|Niger-Kordofanian|North+American+Indian|Norwegian|Nubian|Ojibwa|Old+English|Old+French|Pampanga|Panjabi|Pedi|Persian|Polish|Portuguese|Pushto|Romanian|Romany|Russian|Samoan|Sanskrit|Sign+Language|Slave|Slovak|Slovenian|Somali|Songhai|Spanish|Swahili|Swedish|Swiss+German|Tagalog|Tamashek|Tamil|Telugu|Thai|Tibetan|Tonga|Turkish|Ukrainian|Urdu|Uzbek|Vietnamese|Welsh|Wolof|Xhosa|Yiddish|Yoruba|Zande|Zaza|Zulu)/'
//		NOT grouping_category: 'music'
	]})
//			fq: "language:/(English|None|Undetermined|Unknown)/,language:/(Spanish)/",
//				'language:/(Afrikaans|Afro-Asiatic|Albanian|Amharic|Ancient+Greek|Arabic|Aramaic|Armenian|Azerbaijani|Bambara|Basque|Bengali|Bosnian|Breton|Bulgarian|Burmese|Catalan|Catalan%3B+Valencian|Celtic|Central+Khmer|Chamorro|Chinese|Choctaw|Church+Slavic|Chuukese|Cree|Creole|Creoles|Croatian|Czech|Danish|Dutch|Dyula|Efik|Elamite|Estonian|Ewe|Filipino|Finnish|French|Fulah|Georgian|German|Germanic|Greek|Gujarati|Haitian|Hausa|Hawaiian|Hebrew|Hindi|Hungarian|Icelandic|Indonesian|Inuktitut|Irish|Italian|Japanese|Javanese|Kannada|Karen|Kazakh|Kinyarwanda|Kirghiz|Korean|Kurdish|Latin|Latvian|Lingala|Lithuanian|Macedonian|Malay|Malayalam|Mandingo|Maori|Marathi|Middle+English|Mongolian|Mossi|Multiple|Navajo|Nepal+Bhasa|Nepali|Niger-Kordofanian|North+American+Indian|Norwegian|Nubian|Ojibwa|Old+English|Old+French|Pampanga|Panjabi|Pedi|Persian|Polish|Portuguese|Pushto|Romanian|Romany|Russian|Samoan|Sanskrit|Sign+Language|Slave|Slovak|Slovenian|Somali|Songhai|Spanish|Swahili|Swedish|Swiss+German|Tagalog|Tamashek|Tamil|Telugu|Thai|Tibetan|Tonga|Turkish|Ukrainian|Urdu|Uzbek|Vietnamese|Welsh|Wolof|Xhosa|Yiddish|Yoruba|Zande|Zaza|Zulu)/, NOT grouping_category:music'
	.addParams({
		indent: true,
	})
*/
	.fl('id,title,record_details')
	.rows(100)
	.wt('json')
;

client.search(objQuery, function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   console.log(result);
});

/*
axios.get('http://galacto.library.nashville.org:8180/solr/grouped/select', {
		params: {
// TO DO: make the language query for non-english either (?!English|None|Undetermined|Unknown) or dynamically based on a magic language query
// see https://trello.com/c/ChUPSdgO/142-pika-foreign-language-support#comment-5c48b1aa15db4b3da7366a6d
//			q: 'title:hobbit, language:Spanish',
			q: 'language:/(English|None|Undetermined|Unknown)/, language:/(Afrikaans|Afro-Asiatic|Albanian|Amharic|Ancient+Greek|Arabic|Aramaic|Armenian|Azerbaijani|Bambara|Basque|Bengali|Bosnian|Breton|Bulgarian|Burmese|Catalan|Catalan%3B+Valencian|Celtic|Central+Khmer|Chamorro|Chinese|Choctaw|Church+Slavic|Chuukese|Cree|Creole|Creoles|Croatian|Czech|Danish|Dutch|Dyula|Efik|Elamite|Estonian|Ewe|Filipino|Finnish|French|Fulah|Georgian|German|Germanic|Greek|Gujarati|Haitian|Hausa|Hawaiian|Hebrew|Hindi|Hungarian|Icelandic|Indonesian|Inuktitut|Irish|Italian|Japanese|Javanese|Kannada|Karen|Kazakh|Kinyarwanda|Kirghiz|Korean|Kurdish|Latin|Latvian|Lingala|Lithuanian|Macedonian|Malay|Malayalam|Mandingo|Maori|Marathi|Middle+English|Mongolian|Mossi|Multiple|Navajo|Nepal+Bhasa|Nepali|Niger-Kordofanian|North+American+Indian|Norwegian|Nubian|Ojibwa|Old+English|Old+French|Pampanga|Panjabi|Pedi|Persian|Polish|Portuguese|Pushto|Romanian|Romany|Russian|Samoan|Sanskrit|Sign+Language|Slave|Slovak|Slovenian|Somali|Songhai|Spanish|Swahili|Swedish|Swiss+German|Tagalog|Tamashek|Tamil|Telugu|Thai|Tibetan|Tonga|Turkish|Ukrainian|Urdu|Uzbek|Vietnamese|Welsh|Wolof|Xhosa|Yiddish|Yoruba|Zande|Zaza|Zulu)/, NOT grouping_category:music',
//			q: "title:hobbit",
			q: "*:*",
			fq: [ 
//				fq: "language:/(English|None|Undetermined|Unknown)/",
				"language:Spanish" ,
				"NOT grouping_category:music"
//				'language:/(Afrikaans|Afro-Asiatic|Albanian|Amharic|Ancient+Greek|Arabic|Aramaic|Armenian|Azerbaijani|Bambara|Basque|Bengali|Bosnian|Breton|Bulgarian|Burmese|Catalan|Catalan%3B+Valencian|Celtic|Central+Khmer|Chamorro|Chinese|Choctaw|Church+Slavic|Chuukese|Cree|Creole|Creoles|Croatian|Czech|Danish|Dutch|Dyula|Efik|Elamite|Estonian|Ewe|Filipino|Finnish|French|Fulah|Georgian|German|Germanic|Greek|Gujarati|Haitian|Hausa|Hawaiian|Hebrew|Hindi|Hungarian|Icelandic|Indonesian|Inuktitut|Irish|Italian|Japanese|Javanese|Kannada|Karen|Kazakh|Kinyarwanda|Kirghiz|Korean|Kurdish|Latin|Latvian|Lingala|Lithuanian|Macedonian|Malay|Malayalam|Mandingo|Maori|Marathi|Middle+English|Mongolian|Mossi|Multiple|Navajo|Nepal+Bhasa|Nepali|Niger-Kordofanian|North+American+Indian|Norwegian|Nubian|Ojibwa|Old+English|Old+French|Pampanga|Panjabi|Pedi|Persian|Polish|Portuguese|Pushto|Romanian|Romany|Russian|Samoan|Sanskrit|Sign+Language|Slave|Slovak|Slovenian|Somali|Songhai|Spanish|Swahili|Swedish|Swiss+German|Tagalog|Tamashek|Tamil|Telugu|Thai|Tibetan|Tonga|Turkish|Ukrainian|Urdu|Uzbek|Vietnamese|Welsh|Wolof|Xhosa|Yiddish|Yoruba|Zande|Zaza|Zulu)/, NOT grouping_category:music'
			],
//			fq: "language:/(English|None|Undetermined|Unknown)/,language:/(Spanish)/",
//				'language:/(Afrikaans|Afro-Asiatic|Albanian|Amharic|Ancient+Greek|Arabic|Aramaic|Armenian|Azerbaijani|Bambara|Basque|Bengali|Bosnian|Breton|Bulgarian|Burmese|Catalan|Catalan%3B+Valencian|Celtic|Central+Khmer|Chamorro|Chinese|Choctaw|Church+Slavic|Chuukese|Cree|Creole|Creoles|Croatian|Czech|Danish|Dutch|Dyula|Efik|Elamite|Estonian|Ewe|Filipino|Finnish|French|Fulah|Georgian|German|Germanic|Greek|Gujarati|Haitian|Hausa|Hawaiian|Hebrew|Hindi|Hungarian|Icelandic|Indonesian|Inuktitut|Irish|Italian|Japanese|Javanese|Kannada|Karen|Kazakh|Kinyarwanda|Kirghiz|Korean|Kurdish|Latin|Latvian|Lingala|Lithuanian|Macedonian|Malay|Malayalam|Mandingo|Maori|Marathi|Middle+English|Mongolian|Mossi|Multiple|Navajo|Nepal+Bhasa|Nepali|Niger-Kordofanian|North+American+Indian|Norwegian|Nubian|Ojibwa|Old+English|Old+French|Pampanga|Panjabi|Pedi|Persian|Polish|Portuguese|Pushto|Romanian|Romany|Russian|Samoan|Sanskrit|Sign+Language|Slave|Slovak|Slovenian|Somali|Songhai|Spanish|Swahili|Swedish|Swiss+German|Tagalog|Tamashek|Tamil|Telugu|Thai|Tibetan|Tonga|Turkish|Ukrainian|Urdu|Uzbek|Vietnamese|Welsh|Wolof|Xhosa|Yiddish|Yoruba|Zande|Zaza|Zulu)/, NOT grouping_category:music'
			rows: '1000',
			fl: 'id,title,record_details',
			wt: 'json',
			indent: 'true'
		}
	})
	.then(function (response) {
		console.log(response.request.path);
		console.log(response.data.response.numFound);
		db.insert(response.data.response.docs, function (err, newDocs) {
		})
		db.find({}, function (err, docs) {
			docs.forEach(function (g, h) {
				if (g.record_details.length > 1) {
					const gid = g.id;
					const title = g.title.trim().replace(/["']/g,'');
					g.record_details.forEach(function (b, c) {
						const bib = b.split("|");
						const [bsource, bid] = bib[0].split(":",2);
						const blang = bib[4];
						if (blang != "English") {
// WHAT pika user? or connect more directly to mariadb? create "config.pwd.ini" file, but json :)
// POST params source, recordid, notes
							const sql = 'INSERT INTO vufind.nongrouped_records (source,recordId,notes) '
								+ 'VALUES ("' + bsource + '","' + bid + '","LANGUAGE: ' + title + ' [' + blang + ']") '
								+ 'ON DUPLICATE KEY UPDATE '
								+ 'source = "' + bsource + '", '
								+ 'recordId = "' + bid + '", '
								+ 'notes = "LANGUAGE: ' + title + ' [' + blang + ']";';
							console.log(sql);
						}
					})
				}
		})
		})
	})
	.catch(function (error) {
		console.log(error);
	})
	.then(function () {
		console.log('\n\nall done\n\n');
	});

*/

