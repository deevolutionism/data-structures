var fs = require('fs');
var cheerio = require('cheerio');
var cheerioTableparser = require('cheerio-tableparser');

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
        var items = [];
        // $('table')
        // .children('tbody').each(function(i,elem){
        //   console.log('//////////////');
        //   console.log($(this).eq(0).text());
        //   corpus = $(this).eq(0).text();
        // });

        // var rows = $('table').find('tr');
        // for(var i = 0; i<rows.length;i++){
        //   var current = rows[i];
        //   console.log('iteration loop: ' + i);
        //   console.log(rows.cells.length);
        //   console.log($(current).children().text());
        // };


        $('table').addClass = 'complicated';
        var t = cheerio.load($('table').html());
        // console.log(table.html());
        cheerioTableparser(t);
        var d = t('table').parsetable(false,false,true);
        // for(var i = 0; i<d.length;i++){
        //   for(var j = 0; j<d[i].length;i++){
        //     d[i][j]
        //   }
        // }
        console.log(d[5]);
        // console.log(d[0]);
        // for(var i = 0; i<d.length;i++){
        //   d[0].trim();
        // }


        // var corpus = $('table')
        // .children('tbody')
        // .eq(0).text();
        // console.log(corpus);

        // console.log(corpus);

        // var index = $('table')
        //   .children('tbody')
        //   .children('tr')
        //   .find('td').eq(0)
        //   .each(function(i,elem){
        //     console.log($(elem).text());
        //   });
        // .children('tbody')
        // .children('tr')
        // .find('td').eq(0);
        // console.log(index.text());

        // var indexed = $('table')
        // .children('tbody')
        // .each(function(i,elem){
        //   $('.detailsBox').remove();
        //   var location = $(elem).children('tr').find('td').eq(0);
        //   console.log(location.text());
        // });

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
