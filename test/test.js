var glossary = require("glossary"),
    keywords = require("../keywords"),
    assert = require("assert");

var string = "Patsy Cline \
born in Gore, Virginia, was an American country music singer \
who enjoyed pop music crossover success during the era of the Nashville sound in the early 1960s. \
Since her death in 1963 at age 30 in a private airplane crash, \
she has been considered one of the most influential, successful, \
and acclaimed female singers.";

germanString = "Fachtagung \"Chancen der Vielfalt nutzen lernen\" am 1. Juli in Köln mit Beteiligung der Universität Paderborn http://bit.ly/lYauYm #upb";

assert.deepEqual(glossary.extract(string),["Patsy","Cline","Patsy Cline","Gore","Virginia","American","country","music","singer","American country music singer","pop","crossover","success","pop music crossover success","era","Nashville","sound","Nashville sound","death","age","airplane","crash","airplane crash","one"])

assert.deepEqual(glossary({ minFreq: 2 }).extract(string), ["music","singer"]);

assert.deepEqual(glossary({ collapse: true }).extract(string), ["Patsy Cline","Gore","Virginia","American country music singer","pop music crossover success","era","Nashville sound","death","age","airplane crash","one"]);

assert.deepEqual(glossary({ blacklist: ["singer", "one", "gore", "sound"]}).extract(string), ["Patsy","Cline","Patsy Cline","Virginia","American","country","music","pop","crossover","success","pop music crossover success","era","Nashville","death","age","airplane","crash","airplane crash"])

assert.deepEqual(glossary({ minFreq: 2, verbose: true }).extract(string), [{"count":2,"norm":"music","word":"music"},{"count":2,"norm":"singer","word":"singer"}]);


assert.deepEqual(glossary.extract(germanString),[ 'Fachtagung','"Chancen','der','Vielfalt','nutzen','lernen"','Fachtagung "Chancen der Vielfalt nutzen lernen"','Juli','Köln','mit','Beteiligung','Universität','Paderborn','Köln mit Beteiligung der Universität Paderborn', '#upb' ]);
assert.deepEqual(keywords.extract(germanString),{ terms: [ 'Fachtagung','"Chancen','Vielfalt','lernen"','Fachtagung "Chancen der Vielfalt nutzen lernen"','Juli','Köln','Beteiligung','Universität','Paderborn','Köln mit Beteiligung der Universität Paderborn','#upb' ], language: 'german' });
//"Der vernünftige Mensch passt sich der Welt an; der unvernünftige besteht auf dem Versuch, die Welt sich anzupassen. Deshalb hängt aller Fortschritt vom unvernünftigen Menschen ab."
//console.log(glossary.extract("Die letzten paar Auswertungen der Evaluationen finden statt und werden eingearbeitet"));
//console.log(keywords.extract("Die letzten paar Auswertungen der Evaluationen finden statt und werden eingearbeitet"));
