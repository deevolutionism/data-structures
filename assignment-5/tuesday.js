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
var noIndex = [];




var query = function(count){
  count++;
  var datetimeStart = new Date();
  MongoClient.connect(url, (err, db) => {
    if (err) {return console.dir(err);}
    var collection = db.collection('aagroups_02');

    collection.find({$and: [{'day':'2'},{'time':{$gte:'19:00'}}]}).toArray(function(err, docs) {
        if (err) {console.log(err)}
        else {
          console.log(docs.length);
          // console.log(docs);
          // fs.writeFile('data/tuesday.json',JSON.stringify(docs), function(err){
          //   if(err){console.log(err);}
          //   console.log('success');
          // });
        }
        db.close();
        noIndex.push(new Date() - datetimeStart);
        console.log("This process completed in", new Date() - datetimeStart, "milliseconds.");
        console.log(noIndex);
        count < 25 ? query(count) : console.log('done');
    });
  });
}

// no index [65, 12, 6, 5, 7,6, 7, 7, 11, 19, 30, 7, 7, 5, 11, 6, 6, 13, 6, 4, 5, 8, 5, 4, 10]
// with index [74,24,12,24,12,14,9,12,14,12,11,14,7,8,17,12,7,6,9,7,7,9,8,6,9]

query(0);
