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
const assert = require('assert');


var apiKey = process.env.GMAKE;

var meetingsData = [];
var mapsMeetingsData = [];
var addresses = {};
var collectionName = 'aagroup';
var noIndex = [];

var doTheThings = {

  parse: function(data, callback){
    console.log('parsing . . . ');
    $ = cheerio.load(data);
    $('#meetings_tbody')
    .children()
    .each(function(i,elem){
      var group = {};
      var name = $(elem).find('.name a').text().trim();
        group['location'] = $(elem).find('.location').text().trim();
        group['address'] = $(elem).find('.address').text().trim();
        var address = $(elem).find('.address').text().trim() + 'New York NY';
        group['type'] = $(elem).find('.types').text();
        group['name'] = name;
        group['link'] = $(elem).find('.name a').attr('href');
        group['time'] = $(elem).find('.time').attr('data-sort');
        group['region'] = $(elem).find('.region').text();
        console.log(group);
        meetingsData.push(group); //add group data to the aa meetings collection
    });
    return callback()
  },

  getGroupData: function(callback){
    var tmp = [];
    var count = 0;
    async.eachSeries(meetingsData, function(value, callback){
      console.log(value.link);
      request(value.link,function(error,response,body){
        if(error){
          console.log(error);
        } else if($('dd').html() !== undefined && response.status == 200){
          $ = cheerio.load(body);
          $('dd').each(function(i,elem){
            // console.log($(elem).text());
            if(i==0){
              value['duration'] = $(elem).text().trim();
            } if(i==3){
              value['type'] = $(elem).text();
            } if(i==4){
              value['meeting-notes'] = $(elem).text();
            } if(i==5){
              value['location-notes'] = $(elem).text();
            }
          });
        }
        count++;
        console.log('===============');
        console.log(count);
        console.log(value);
        tmp.push(value);
        setTimeout(callback, 10);
      });
    }, function(){
      meetingsData = tmp;
      console.log(meetingsData.length);
    });
    return callback();
  },

  getGeometries: function(data) {
    console.log('requesting geometries from google maps api . . . ');
    console.log(data);

    //loop through each address
    //find the group associated with the address
    //get long and lat from google maps
    //store geomertries with the group
    var count = 0;
    async.eachSeries(JSON.parse(data), function(value, callback) {
        var apiRequest = `https://maps.googleapis.com/maps/api/geocode/json?address=${value.address.split(' ')}+${value.region.split(' ').join('+')}+NY&key=${apiKey}`;

        if(addresses[value.address] == undefined){ //prevent querying duplicate locations by keeping track
          request(apiRequest, function(err, resp, body) {
            if (err) {console.log(err)}
            if(JSON.parse(body).status == 'OK'){
              count++;
              console.log('===========');
              console.log(count);
              console.log(apiRequest);
              console.log(emoji.emojify(`:globe_with_meridians: ${JSON.parse(body).results[0].geometry.location}`));
              value['lat'] = JSON.parse(body).results[0].geometry.location.lat;
              value['long'] = JSON.parse(body).results[0].geometry.location.lng;
              value['formatted_address'] = JSON.parse(body).results[0].formatted_address;
              mapsMeetingsData.push(value);
              addresses[value.address] = true;
              for(var i = 0; i<meetingsData.length; i++){ //search for duplicate locations and add the formatted address
                if( mapsMeetingsData[i].address == value.address){
                  console.log(`found duplicate for ${value.address}`);
                  mapsMeetingsData[i].formatted_address = value['formatted_address'];
                }
              }
            }
          });
        }
        setTimeout(callback, 300);
    }, function() {

        MongoClient.connect(url, function(err, db) {
          if (err) {return console.dir(err);}
          var collection = db.collection(collectionName);
          // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
          console.log(mapsMeetingsData.length);
          for (var i=0; i < mapsMeetingsData.length; i++) {
            collection.insert(mapsMeetingsData[i]);
          }
          console.log('saved to mongo');
          db.close();
        });
        fs.writeFile('data/google-meeting-groups.json',JSON.stringify(mapsMeetingsData),function(err){
          if(err){throw err}
          console.log(emoji.emojify('saved geometries! :rocket:'));
        });
        // console.log(meetingsData);
      });

  },

  makeRequest: function(url, callback){//3.a
    console.log('requesting ' + url + ' >>>');
    request(url,function(error,response,body){
      if(!error && response.statusCode == 200){
        fs.writeFile('data/aameetings.txt',body,function(err){
          if(err) {
            console.log(err);
          } else {
            return callback();
          }
        });
      } else {
        console.log(error);
      }
    });
  },

  readData: function(){ //3.b
    console.log('reading aameetings.txt');
    fs.readFile('data/aameetings.txt','utf8',function(error,data){
      if(error){
        console.log(error);
      } else {
        doTheThings.parse(data,function(){ //parse file
          // console.log(meetingsData);
          doTheThings.getGroupData(function(){
            console.log('writing meeting-groups file . . .');
            fs.writeFile('data/meeting-groups.json',JSON.stringify(meetingsData),function(err){
              if(err){
                console.log(err);
              } else {
                // console.log(meetingsData);
                // doTheThings.getGroupData();
                console.log('success!');
                // doTheThings.getGeometries();
              }
            });
          });

          // getNotes();
        });
      }
    });
  },

  requestMeetings: function(){
    //1. first check if the data file already exists
    fs.readFile('data/aameetings.txt', function(error,data){
      if(error){ // 2.a file doesn't exist, make a request to get it.
        console.log('making data/ directory');
        fs.mkdirSync('data/'); //create the directory
        doTheThings.makeRequest('http://meetings.nyintergroup.org/?d=any&v=list', function(){
          console.log('saved file');
          doTheThings.readData(); //3.a
        });
      } else { //2.b file exists already, read and parse it.
        doTheThings.readData();
      }
    });
  }

}

var testMongo = function(){
  MongoClient.connect(url, function(err, db) {
    if(err){console.log(err)}
    console.log('success');
    db.close();
  });
}

var putFileMongo = function(file){
  fs.readFile(`data/${file}`,'utf8',function(err, data){
    if(err){console.log(err)}
    else {
      var parsedData = JSON.parse(data);

      MongoClient.connect(url, (err, db) => {
        if(err){return console.dir(err);}
        var collection = db.collection('aagroups');
        for(var i = 0; i<parsedData.length;i++){
          collection.insert(parsedData[i]);
        }
        console.log('success');
      });
    }
  });
}

var query = function(count){
  count++;
  var datetimeStart = new Date();
  MongoClient.connect(url, (err, db) => {
    if (err) {return console.dir(err);}
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
        noIndex.push(new Date() - datetimeStart);
        console.log("This process completed in", new Date() - datetimeStart, "milliseconds.");
        count < 25 ? query(count) : console.log(done);
    });
  });
}

var refactorTime = () => {
  MongoClient.connect(url, function(err, db){
    if(err){return console.dir(err);}
    var collection = db.collection('aagroups');
    var locations = [];
    var locs = []
    collection.aggregate().toArray(function(err, docs){
      if(err){console.log(err)}
      else {
        for(var i = 0; i<docs.length;i++){
          console.log(i);
          locations.push(docs[i].formatted_address);
          // locations.push({
          //   'address':docs[i].formatted_address,
          //   'geometries':{'lat':docs[i].lat,'lng':docs[i].long},
          //   'groups':[]
          // });
          docs[i]['day'] = docs[i].time[0];
          docs[i]['time'] = docs[i].time.substr(docs[i].time.indexOf('-') + 1);
          // group['day'] = docs[i].time[0];
          // group['time'] = docs[i].time.substr(docs[i].index)
          // meetingsData.push(group);

        }
        locations = uniq_fast(locations)

        //put each group into coresponding location
        for( var k = 0; k<locations.length; k++){
          var loc = {};
          loc['address'] = locations[k];
          loc['groups'] = [];
          loc['geometries'] = {'lat':docs[k].lat,'lng':docs[k].long}
          for (var l = 0; l<docs.length;l++){

            if(locations[k] == docs[l].formatted_address){
              //add matched group to current location
              console.log('match')
              loc['groups'].push({
                'name':docs[l].name,
                'time':docs[l].day,
                'day':docs[l].time,
                'link':docs[l].link,
                'region':docs[l].region
              });
            }
          }
          locs.push(loc);
        }

        console.log(locations.length);
        for(var j = 0; j<locations.length; j++){
          db.collection('aagroups_03').insert(locs[j]);
        }
      }
    });
  });
}

var refactordb = () => {
  var locations = []
  fs.readFile('data/google-meeting-groups.json','utf8',(err,data)=>{

    d = JSON.parse(data);

    for(var i = 0; i<d.length;i++){
      locations.push(d[i].formatted_address);
    }
    locations = uniq_fast(locations);
    for(var j = 0; j<locations.length;j++){
      var loc = {
        'location':locations[i]
      };

      for(var k = 0; k<d.length;k++){
        var groups = [];
        if(loc == d[k].formatted_address){
          //add group to same location
          loc['geometries'] = d[k].geometries;
          // groups.push({
          //   'name':d[k].name,
          //   ''
          // });
        }
      }
    }
  });
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    console.log(a[0])
    for(var i = 0; i < len; i++) {
         var item = a[i];

         if(seen[item] !== 1) {

               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

var updateTime = (db,callback) => {

  db.collection('aagroups').updateMany(
     {},
     {
       $set: { time: $time.substr($time.indexOf('-') + 1) },
       $set: { "day": $time[0] }
     }
     ,
     (err, results) => {
       console.log(results);
       callback();
     }
  );
}


var UpdateTime = () => {
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  updateTime(db, function() {
      db.close();
  });
});
}

var update_time = () => {
  MongoClient.connect(url, (err, db)=>{
    if(err){console.log(err)} else {
      db.collection('aagroups').find({}).forEach(function(e,i) {
        console.log(e.time);
        e.time=e.time.replace(e.time.substr(e.time.indexOf('-')));
        db.aagroups.save(e);
      });
    }
});
}


// console.log('type ' + colors.cyan('request meetings') + ' or ' + colors.cyan('write to database') + ' or ');
console.log(
  `type a number to activate the corresponding function
   1 for => ${colors.cyan('put meetings')}
   2 for => ${colors.cyan('query database')}
   3 for => ${colors.cyan('test mongo')}
   4 for => ${colors.cyan('get geometries')}
   5 for => ${colors.cyan('refactor time')}
   6 for => ${colors.cyan('put file to mongo')}
`);

prompt.start();
prompt.get(['function'], (err, result) => {
  console.log(result.function);
  if(result.function == 1){
    doTheThings.requestMeetings();
  } else if(result.function == 2){
    query();
  } else if(result.function == 3){
    testMongo();
  } else if(result.function == 4){
    fs.readFile('data/meeting-groups.json','utf8',(err, data) => {
      doTheThings.getGeometries(data);
    });
    // doTheThings.getGeometries();
  } else if(result.function == 5){
    refactorTime();
    // refactordb();
    // UpdateTime();
    // update_time();
  } else if(result.function == 6){
    putFileMongo('google-meeting-groups.json');
  }
});
// doTheThings.requestMeetings();
