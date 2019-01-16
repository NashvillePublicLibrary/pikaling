const axios = require('axios');

axios.get('http://galacto.library.nashville.org:8180/solr/grouped/select?q=language%3A%2F(English%7CNone%7CUndetermined%7CUnknown)%2F%0Alanguage%3A%2F(Afrikaans%7CAfro-Asiatic%7CAlbanian%7CAmharic%7CAncient%2BGreek%7CArabic%7CAramaic%7CArmenian%7CAzerbaijani%7CBambara%7CBasque%7CBengali%7CBosnian%7CBreton%7CBulgarian%7CBurmese%7CCatalan%7CCatalan%253B%2BValencian%7CCeltic%7CCentral%2BKhmer%7CChamorro%7CChinese%7CChoctaw%7CChurch%2BSlavic%7CChuukese%7CCree%7CCreole%7CCreoles%7CCroatian%7CCzech%7CDanish%7CDutch%7CDyula%7CEfik%7CElamite%7CEstonian%7CEwe%7CFilipino%7CFinnish%7CFrench%7CFulah%7CGeorgian%7CGerman%7CGermanic%7CGreek%7CGujarati%7CHaitian%7CHausa%7CHawaiian%7CHebrew%7CHindi%7CHungarian%7CIcelandic%7CIndonesian%7CInuktitut%7CIrish%7CItalian%7CJapanese%7CJavanese%7CKannada%7CKaren%7CKazakh%7CKinyarwanda%7CKirghiz%7CKorean%7CKurdish%7CLatin%7CLatvian%7CLingala%7CLithuanian%7CMacedonian%7CMalay%7CMalayalam%7CMandingo%7CMaori%7CMarathi%7CMiddle%2BEnglish%7CMongolian%7CMossi%7CMultiple%7CNavajo%7CNepal%2BBhasa%7CNepali%7CNiger-Kordofanian%7CNorth%2BAmerican%2BIndian%7CNorwegian%7CNubian%7COjibwa%7COld%2BEnglish%7COld%2BFrench%7CPampanga%7CPanjabi%7CPedi%7CPersian%7CPolish%7CPortuguese%7CPushto%7CRomanian%7CRomany%7CRussian%7CSamoan%7CSanskrit%7CSign%2BLanguage%7CSlave%7CSlovak%7CSlovenian%7CSomali%7CSonghai%7CSpanish%7CSwahili%7CSwedish%7CSwiss%2BGerman%7CTagalog%7CTamashek%7CTamil%7CTelugu%7CThai%7CTibetan%7CTonga%7CTurkish%7CUkrainian%7CUrdu%7CUzbek%7CVietnamese%7CWelsh%7CWolof%7CXhosa%7CYiddish%7CYoruba%7CZande%7CZaza%7CZulu)%2F%0ANOT+grouping_category%3Amusic&rows=10000&fl=title%2Crecord_details&wt=json&indent=true')
	.then(response => {
		console.log(response.data.url);
		console.log(response.data.explanation);
	})
	.catch(error => {
		console.log(error);
	});
