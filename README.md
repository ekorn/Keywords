# Keywords

Basicly this is just a extension to to [glossary](https://github.com/harthur/glossary) it add language detection via [node-language-detect](https://github.com/FGRibreau/node-language-detect) 
and filters out some stopwords (from [ranks.nl](http://www.ranks.nl/resources/stopwords.html) ) 
to improve non English results. I use it in the following way:

```javascript
var text = "some text";
var clearedText =  keywords.clearText(text, [regExUrls,regExHashtags,regExUsernames]);
var words;
var detectedlanguage = keywords.detectLanguage(clearedText);

if(detectedlanguage.length !== 0){//Some language is detected
  //Improve detection by adding knowledge about the previous detections
  var lang = keywords.improveLanguageDetection(detectedlanguage, calcLanguage, languageStats);
  languageStats = lang.languagesSoFar;//Save statistic for next round
  detectedlanguage = lang.languagesFromText[0][0]; //Save improved results

  //Filter common stopwords for the detected language 
  clearedText = keywords.filterStopwords(detectedlanguage, clearedText);

  //Extract Keywords 
  words = keywords.extract(clearedText);
}else{
  words = keywords.extract(clearedText);
}

var calcLanguage = function(a,b){
return (a+a+b)/3
};
```
