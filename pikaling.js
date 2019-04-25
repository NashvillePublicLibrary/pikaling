// TO DO: James learns ecma 2017 for real
// TO DO: force SSL on all transmitted messages
// TO DO: separation of concern? move SQL language from getDocs into mariadbInsert()

const envresult = require('dotenv').config();
var solr = require('solr-client');
var client = solr.createClient({
	host: process.env.SOLR_HOST,
	port: process.env.SOLR_PORT,
	core: process.env.SOLR_CORE
});
const mariadb = require('mariadb');

async function getLanguages(client) {
	var getLanguagesQuery = client.createQuery()
		.q('*:*')
		.rows(0)
		.set('stats=true')
		.set('stats.field=language')
		.set('stats.calcdistinct=true')
	;
	const r = await client.searchAsync(getLanguagesQuery)
	var s = r.stats.stats_fields.language.distinctValues;
	var t = ['English', 'None', 'Undetermined', 'Unknown'];
	t.forEach(function (u, v) {
		w = s.indexOf(u);
		if (w > -1) {
			s.splice(w, 1);
		}
	});
	languages = '/(' + s.join('|') + ')/';
	return(languages);
}

async function getDocs(client, languages) {
	var getDocsQuery = client.createQuery()
		.q('*:*')
		.matchFilter('language','English')
		.matchFilter('language', languages)
		.matchFilter('NOT+grouping_category','music')
		.fl('id,title,record_details')
		.rows(10000)
	;
	sqls = [];
	const r = await client.searchAsync(getDocsQuery);
	r.response.docs.forEach(function (g, h) {
		// tests record_details for more than one bib AND at least one bib with English
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
					sqls.push(sql);
				}
			});
		}
	});
	return(sqls);
}

async function mariadbInsert(sqls) {
	try {
		const conn = await mariadb.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			ssl: process.env.DB_SSL,
			database: process.env.DB_DATABASE,
			connectionLimit: process.env.DB_CONNECTIONLIMIT
		});
		sqls.forEach(async function (sql,i) {
			console.log(sql);
			const result = await conn.query(sql);
			console.log(result);
		});
		conn.end();
	} catch (err) {
		throw err;
	}
}

async function ungroup(client) {
	try {
		const languages = await getLanguages(client);
		const sqls = await getDocs(client, languages);
		const result = await mariadbInsert(sqls);
	} catch (err) {
		throw err;
	}
}

ungroup(client);
