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
    var new_count = ++count;
    if(new_count < 10){
      new_count = '0' + new_count;
    }
    console.log('reading ' + path + new_count + suffix + ' >>>>>>>>>>>>>>');
    fs.readFile(path+new_count+suffix,'utf8',function(err,data){
      if(err){
        console.log(err);
      } else {
        var $ = cheerio.load(data);
        // var indexed = $('center').get();
        var indexed = $('table')
        .children('tbody')
        .each(function(i,elem){
          $('.detailsBox').remove();
          var location = $(elem).children('tr').find('td').eq(0);
          // location.remove('h4');
          console.log(location.text());
          // console.log($(elem).children('tr').find('td').eq(0).text());
        });
        // console.log(indexed);
        // .each(function(i,elem){
        //   // console.log($(this).find('h4').text());
        //   console.log('--------------')
        //   console.log($(elem).length);
        //   // $(elem).remove('h4');
        //   // $(elem).remove('br');
        //   // $(elem).remove('b');
        //   // $(elem).remove('div');
        //   // console.log($(elem).text());
        // });

        // console.log(indexed);
        // var sliced = $('center').slice(1).eq(0).text();
        // console.log(indexed);
        if(count < 1){
        readFileRecursively(path,count,suffix);
        }
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
