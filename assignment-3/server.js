var request = require('request'); // npm install request
var async = require('async'); // npm install async
var cheerio = require('cheerio');
var fs = require('fs');
var $;

// SETTING ENVIRONMENT VARIABLES (in Linux):
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grep NEW_VAR
var apiKey = process.env.GMAKE;

var meetingsData = {};
var addresses = ["63 Fifth Ave, New York, NY", "16 E 16th St, New York, NY", "2 W 13th St, New York, NY"];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
// async.eachSeries(addresses, function(value, callback) {
//     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
//     var thisMeeting = new Object;
//     thisMeeting.address = value;
//     request(apiRequest, function(err, resp, body) {
//         if (err) {throw err;}
//         thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
//         meetingsData.push(thisMeeting);
//     });
//     setTimeout(callback, 2000);
// }, function() {
//     console.log(meetingsData);
// });

var parse = function(data,callback){
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
      meetingsData[name] = group; //add meeting group data to the collection
    } else {
      console.log(meetingsData[name].time);
      meetingsData[name].time.push($(elem).find('.time').attr('data-sort'));
    }
  });
  return callback()
}

var getNotes = function(){
  var count = 0;
  async.eachSeries(meetingsData,function(value,callback){
    request(value.name,function(error,response,body){
      if(!error && response.statusCode == 200){
        count++;
        fs.writeFile('data/'+count+'.txt', body, function(error){
          if(!error){
            console.log('wrote ' + value.name);
          } else {
            console.log(error);
          }
        });
      } else {
        console.log(error);
      }
      return callback()
    });
  });
}


fs.readFile('data/aameetings.txt','utf8',function(error,data){

  parse(data,function(){
    // console.log(meetingsData);
    fs.writeFile('data/meeting-groups.json',data,function(err){
      if(err){
        console.log(err);
      } else {
        console.log(meetingsData);
      }
    });
    // getNotes();
  });

});

// request('http://meetings.nyintergroup.org/?d=any&v=list',function(error,response,body){
//   if(!error && response.statusCode == 200){
//     fs.writeFile('data/aameetings.txt',body,function(err){
//       if(err){
//         console.log(err);
//       } else{
//         console.log('saved file');
//       }
//     });
//   } else {
//     console.log(error);
//   }
// });
