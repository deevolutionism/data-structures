var request = require('request'); // npm install request
var async = require('async'); // npm install async
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var emoji = require('node-emoji');
var object = require('lodash/fp/object');
var prompt = require('prompt');
var colors = require("colors/safe");
var $;
var url = 'mongodb://localhost:27017/aameetings';
var MongoClient = require('mongodb').MongoClient;
var apiKey = process.env.GMAKE;


var query = function(){
  MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}
    var datetimeStart = new Date();
    var collection = db.collection('aa_meeting_time');

    collection.find({$and: [{'day':'2'},{'time':{$gte:'19:00'}}]}).toArray(function(err, docs) {
        if (err) {console.log(err)}
        else {
          console.log(docs);
          fs.writeFile('data/tuesday.json',JSON.stringify(docs), function(err){
            if(err){console.log(err);}
            console.log('success');
          });
        }
        db.close();
        console.log("This process completed in", new Date() - datetimeStart, "milliseconds.");
    });
  });
}

query();
