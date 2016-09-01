var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var port = 3001;
app.listen(port, function(){
  console.log('app listening on port ' + port);
});

var boroughs = ['01','02','03','04','05','06','07','08','09',10];

var documents = [];
boroughs.forEach(function(borough){
  request('http://visualizedata.github.io/datastructures/data/m'+borough+'.html', function(error, response, body){
    if(!error && response.statusCode == 200){
      documents.push(body);
    } else {
      console.error('error');
    }
  });
});










// T E S T S //


// request('http://www.nyintergroup.org/meetinglist/areamap.cfm?boro=M', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     fs.writeFileSync('data/boroughs.txt', body);
//     console.log('saved file to data folder');
//     parseHTML();
//   }
//   else {console.error('request failed')}
// });


// request('http://visualizedata.github.io/datastructures/data/m01.html', function(error, response, body){
//   if(!error && response.statusCode == 200){
//     console.log('success');
//   } else {
//     console.error('failure');
//   }
// })





// var url = 'http://visualizedata.github.io/datastructures/data/m';
// var html = '.html';
// for(var i = 0; i<boroughs.length;i++){
//   var urlString = url+boroughs[i]+html;
//   console.log(urlString);
//   request('http://visualizedata.github.io/datastructures/data/m01.html', function(error, response, body) {
//     if(!error && response.statusCode == 200){
//       var fileName = 'data/' + boroughs[i] + '.txt';
//       fs.writeFileSync(fileName, body);
//       console.log('save file as ' + fileName + ' to the data directory');
//     } else {
//       console.error('request failed');
//     }
//   });
// }


// var getHTML(borough){
//   request('http://visualizedata.github.io/datastructures/data/m'+borough+'.html', function(error, response, body){
//     if(!error && responseCode == 200){
//       var fileName = 'data/' + borough + '.txt'
//     }
//   })
// }





// var parseHTML = function(){
//   fs.readFile('data/boroughs.txt','utf8', function (err, data) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log('success!');
//       var elements = [];
//       var $ = cheerio.load(data);
//       var table = $('table').nextAll();
//       // console.log(table[4]);
//       // console.log(table.contents().length);
//       $(table).each(function(i,elem){
//         elements[i] = $(this).html();
//         console.log(elements[i]);
//         console.log('>>>>>>>>>>>');
//       });
//       // console.log(elements.length);
//       // console.log(table[1].children[0]);
//     }
//   });
// }

// parseHTML();
