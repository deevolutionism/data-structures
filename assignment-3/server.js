var request = require('request'); // npm install request
var async = require('async'); // npm install async
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var emoji = require('node-emoji');
var object = require('lodash/fp/object');
var $;



var apiKey = process.env.GMAKE;

var meetingsData = {};
var addresses = [];

var doTheThings = {

  parse: function(data, callback){
    console.log('parsing . . . ');
    $ = cheerio.load(data);
    $('#meetings_tbody')
    .children()
    .each(function(i,elem){
      var group = {};
      var name = $(elem).find('.name a').text().trim();
      if(meetingsData[name] === undefined){ //check if meeting group has been added
        group['location'] = $(elem).find('.location').text().trim();
        group['address'] = $(elem).find('.address').text().trim();
        addresses.push($(elem).find('.address').text().trim());
        group['type'] = $(elem).find('.types').text();
        group['geometries'] = null;
        group['link'] = $(elem).find('.name a').attr('href');
        group['time'] = [$(elem).find('.time').attr('data-sort')];
        group['region'] = $(elem).find('.region').text();
        meetingsData[name] = group; //add meeting group data to the collection
      } else {
        // console.log(meetingsData[name].time);
        meetingsData[name].time.push($(elem).find('.time').attr('data-sort'));
      }
    });
    return callback()
  },

  getGroupData: function(){
    request('http://meetings.nyintergroup.org/meetings/we?d=any&v=list',function(error,response,body){
      $ = cheerio.load(body);
      $('dt').each(function(i,elem){
        console.log('===========');
        console.log($(elem).html());
      });
    });
  },

  getGeometries: function() {
    console.log('requesting geometries from google maps api . . . ');
    var geometries = null;
    // var address = addresses[count];

    //loop through each address
    //find the group associated with the address
    //get long and lat from google maps
    //store geomertries with the group

    async.eachSeries(addresses, function(value, callback) {
        var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
        var group = _.findKey(meetingsData, function(group){return group.address == value;});
        console.log(group);
        request(apiRequest, function(err, resp, body) {
            if (err) {console.log(err)}
            if(JSON.parse(body).status == 'OK'){
              console.log(emoji.emojify(':globe_with_meridians: '+JSON.parse(body).results[0].geometry.location));
              meetingsData[group].geometries = JSON.parse(body).results[0].geometry.location;
            // _.set(meetingsData,group.geometries,JSON.parse(body).results[0].geometry.location);
            // console.log(meetingsData[group]);
          }
        });
        setTimeout(callback, 500);
    }, function() {
        fs.writeFile('data/meeting-group.txt',meetingsData,function(err){
          if(err){throw err}
          console.log(emoji.emojify('saved geometries! :rocket:'));
        });
        console.log(meetingsData);
    });

  },

  makeRequest: function(url, callback){//3.a
    console.log('requesting ' + url + ' >>>');
    request(url,function(error,response,body){
      if(!error && response.statusCode == 200){
        fs.writeFile('data/aameetings.txt',body,function(err){
          if(err){
            console.log(err);
          } else{
            return callback()
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
          console.log('writing meeting-groups file . . .');
          fs.writeFile('data/meeting-groups.json',JSON.stringify(meetingsData),function(err){
            if(err){
              console.log(err);
            } else {
              // console.log(meetingsData);
              // doTheThings.getGroupData();
              console.log(addresses.length)
              doTheThings.getGeometries();
            }
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

doTheThings.requestMeetings();
