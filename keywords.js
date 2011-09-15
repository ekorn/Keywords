var _ = require('underscore')._,
    LanguageDetect = require('languagedetect'),
    lngDetector = new LanguageDetect(),
    glossary = require("glossary"),
    language = readAllStopwordFilesSync(__dirname+"/stopwords");

  
function extract(text, options){
  return glossary(options).extract(text);
}

function detectLanguage(text){
  return lngDetector.detect(text);
}

function filterStopwords(textLang, terms){
  var stringmode = false;
  if(_.isString(terms)){
    stringmode = true;
    terms = terms.split(" ");
  }
  if(_.contains(_.keys(language),textLang)){
   terms = _.reject(terms, function(term) {
      return _(language[textLang]).any(function(stopword) {
         return term.toLowerCase() === stopword;
      }) 
   })
  }
  if(stringmode)
    return terms.join(" ");
  else
    return terms;
}

function improveLanguageDetection(languagesFromText, calculateVal, languagesSoFar ){
  if(languagesSoFar == null ){
    return {"languagesFromText": languagesFromText, "languagesSoFar": {"languages": languagesFromText, "weight": 1}};
  }

  languagesSoFar.weight++;
  _.each(languagesFromText, function(lang){
    if(lang[1]>0){
      //Detect if we already seen the language
      var isIn = _.detect(languagesSoFar.languages, function(usedLang){
        return usedLang[0] === lang[0];
      });
      
      var likelyLanguageVal;
      //No lets and it
      if(_.isUndefined(isIn)){
        //console.log("languagesSoFar",languagesSoFar, lang);
        languagesSoFar.languages.push(lang);
        likelyLanguageVal = lang[1];
      }else{//Yes, lets increase
        isIn[1]+= lang[1];
        likelyLanguageVal = isIn[1];
      }
      //Calculate the new statistical adjustet value;
      lang[1] = calculateVal(lang[1], (likelyLanguageVal/languagesSoFar.weight));
    }
  });
  languagesSoFar.languages = _.sortBy(languagesSoFar.languages, function(lang){
    return -lang[1];
  })
  languagesFromText = _.sortBy(languagesFromText, function(lang){
    return -lang[1];
  })
  return {"languagesFromText": languagesFromText, "languagesSoFar": languagesSoFar};
}

function clearText (text, regExs){
  
  _.each(regExs, function(regEx){
    text = text.replace(regEx, "");
  })
  return text;
}

function readAllStopwordFilesSync(path){
    var languanges = {};
  files = fs.readdirSync(path);
  files.forEach(function (filename){
    var data = fs.readFileSync(path+"/"+filename).toString();
    languanges[filename.split("-")[0]] = data.split("\n");
  });
  
  return languanges;
}

function readAllStopwordFiles(path,callback){
  var languanges = {};
  var readCount = 0;
  
  fs.readdir(path, function(err, files){
    if (err) throw err;
    files.forEach(function (filename){
        fs.readFile(path+"/"+filename, function(err, data){
          if (err) throw err;
          languanges[filename.split("-")[0]] = data.toString().split("\n");
          readCount++;
          if(readCount === files.length)
            callback(languanges);
        });
    });
  })
}

//Exports
exports.clearText = clearText;
exports.extract = extract; 
exports.detectLanguage = detectLanguage;
exports.improveLanguageDetection= improveLanguageDetection;
exports.filterStopwords = filterStopwords;

