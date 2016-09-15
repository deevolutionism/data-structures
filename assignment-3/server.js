var request = require('request'); // npm install request
var async = require('async'); // npm install async
var cheerio = require('cheerio');
var fs = require('fs');
var $;

var apiKey = process.env.GMAKE;

var meetingsData = {};

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
        group['type'] = $(elem).find('.types').text();
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

  getGeometriesRecursively: function(url, callback){

  },

  makeRequest: function(url, callback){
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

  readData: function(){
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
              doTheThings.getGroupData();
            }
          });
          // getNotes();
        });
      }
    });
  },

  requestMeetings: function(){
    //first check if the data file already exists
    fs.readFile('data/aameetings.txt', function(error,data){
      if(error){ //file doesn't exist, make a request to get it.
        console.log('making data/ directory');
        fs.mkdirSync('data/'); //create the directory
        doTheThings.makeRequest('http://meetings.nyintergroup.org/?d=any&v=list', function(){
          console.log('saved file');
          doTheThings.readData();
        });
      } else { //file exists already, read and parse it.
        doTheThings.readData();
      }
    });
  }

}

doTheThings.requestMeetings();
