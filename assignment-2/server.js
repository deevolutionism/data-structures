var fs = require('fs');
var cheerio = require('cheerio');

// var content = fs.readFileSync('/home/ubuntu/workspace/data/syllabus.txt');
//
// var $ = cheerio.load(content);

// Print to console: all reading assignments
// $('h4').each(function(i, elem) {
//     if ($(elem).text() == "Read") {
//         $(elem).next().find('li').each(function(i, elem) {
//             console.log($(elem).text());
//         });
//     }
// });



var htmlScraper = (function(){
  var files = [];

  var readFileRecursively = function(path,count,suffix){
    if(count < 10){
      count++;
      count = '0' + count;
    }
    console.log('reading ' + path + count + suffix);
    fs.readFile(path+count+suffix,'utf8',function(err,data){
      if(err){
        console.log(err);
      } else {
        var $ = cheerio.load(data);
        console.log(data);
        readFileRecursively(path,count,suffix);
      }
    });
  };

  return {
    getFiles: function(path,count,suffix){
      readFileRecursively(path,count,suffix);
    }
  }
})();

var path = 'data/';
var suffix = '.txt';
htmlScraper.getFiles(path,0,suffix);
