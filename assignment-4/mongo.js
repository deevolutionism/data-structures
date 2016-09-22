var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var url = 'mongodb://' + 'localhost' + ':27017/test';
// Retrieve

var meetingsData = [];

fs.readFile('data/meetingsData.txt','utf8',function(err,data){
  if(err){
    console.log(error);
  } else {
    meetingsData = JSON.parse(data).locations;
    console.log('read data');
    doTheThing();
  }
});

var doTheThing = function(){
  MongoClient.connect(url, function(err, db) {
   if (err) {return console.dir(err);}
   console.log(meetingsData.length);
   var collection = db.collection('aameetings');
     // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
   for (var i=0; i < meetingsData.length; i++) {
     collection.insert(meetingsData[i]);
   }
   db.close();
  });
}
