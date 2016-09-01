var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var port = 3000;
app.listen(port, function(){
  console.log('app listening on port ' + port);
});

// request('http://www.nyintergroup.org/meetinglist/areamap.cfm?boro=M', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     fs.writeFileSync('data/boroughs.txt', body);
//     console.log('saved file to data folder');
//     parseHTML();
//   }
//   else {console.error('request failed')}
// });

var parseHTML = function(){
  fs.readFile('data/boroughs.txt','utf8', function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('success!');
      var elements = [];
      var $ = cheerio.load(data);
      var table = $('table').nextAll();
      // console.log(table[4]);
      // console.log(table.contents().length);
      $(table).each(function(i,elem){
        elements[i] = $(this).html();
        console.log(elements[i]);
        console.log('>>>>>>>>>>>');
      });
      // console.log(elements.length);
      // console.log(table[1].children[0]);
    }
  });
}

parseHTML();
