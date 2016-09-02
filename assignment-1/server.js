var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var express = require('express');
var async = require('async');
var each = require('async/each');
var app = express();
var port = 3001;
app.listen(port, function(){
  console.log('app listening on port ' + port);
});

var boroughs = ['01','02','03','04','05','06','07','08','09',10];
count = 0;
var documents = [];

//request, then write file to disk. After successful write, make next request

// boroughs.forEach(function(borough){
//   request('http://visualizedata.github.io/datastructures/data/m'+borough+'.html', function(error, response, body){
//     if(!error && response.statusCode == 200){
//       documents.push(body);
//       var file = body;
//
//       console.log('storing document');
//     } else {
//       console.error('error');
//     }
//   });
// });


// for(var i = 0; i < boroughs.length; i++){
//   request('http://visualizedata.github.io/datastructures/data/m'+boroughs[i]+'.html', function(error, response, body){
//     if(!error && response.statusCode == 200){
//       fs.writeFile(body,'data/'+boroughs[i]+'.txt',function());
//     } else {
//       console.error('error!');
//     }
//   });
// }

  // new Promise(function(resolve, reject) {
  // 	// A mock async action using setTimeout
  //     request('http://visualizedata.github.io/datastructures/data/m'+boroughs[i]+'.html', function(error, response, body){
  //       if(!error && response.statusCode == 200){
  //         console.log('hey');
  //         resolve({'body':body, 'borough':i});
  //       } else {
  //         console.error('error!');
  //       }
  //     });
  // })
  // .then(function(result) {
  //   console.log(result.borough);
  // 	fs.writeFileSync('data/'+boroughs[result.borough]+'.txt', result.body);
  // });


  new Promise(function(resolve, reject) {
    for(var i = 0; i<boroughs.length; i++){
      console.log(i);
      request('http://visualizedata.github.io/datastructures/data/m'+boroughs[i]+'.html', function(error, response, body){
        documents.push(body);
        console.log(i);
      });
    }
  }).then(function(result){
    console.log('hey');
    async.each(documents, saveFile, function(err){
      console.log(err);
    });
  });

  function saveFile(file){
    console.log('saved a file');
    fs.writeFileSync('data/'+boroughs[count]+'.txt', file);
    count++;
  }



// for(var i = 0; i<documents.length;i++){
//   fs.writeFileSync('data/01.txt');
// }

// documents.forEach(function(document){
//   console.log(documents.length);
//   var file = '/data'+document+'.txt';
//   fs.writeFileSync(file, body);
// });










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
