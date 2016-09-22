//1. scrape addresses
//2. query google geo api for location / address
//3. store that data into mongodb

var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio
var request = require('request');
var async = require('async');
var apiKey = process.env.GMAKE;
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

var content = fs.readFileSync('data/01.txt');
var meetings = [];
var meetingsData = [];
var address = '';

var $ = cheerio.load(content);

$('tbody').find('tr').each(function(i, elem){
  address = $(elem)
    .find('td')
    .eq(0)
    .html()
    .split('<br>')[2]
    .trim();
  address = address.substring(0,address.indexOf(','));
  address = address + ', New York, NY';
  meetings.push(address);
});

console.log(meetings.length); // print number of meetings in meetings array
fs.writeFileSync('meetingsArray.txt', JSON.stringify(meetings));

async.eachSeries(meetings, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (JSON.parse(body).status == 'OK'){
        console.log('==>' + apiRequest);
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        thisMeeting.formattedAddress = JSON.parse(body).results[0].formatted_address;
        meetingsData.push(thisMeeting);
      } else {
        console.log('something wrong with this request: ' + apiRequest);
      }
    });
    setTimeout(callback, 1000);
}, function() {
    // console.log(meetingsData);
    // Connection URL
    meetingsObject = new Object;
    meetingsObject.locations = meetingsData;
    console.log(meetingsObject);
    fs.writeFileSync('data/meetingsData.txt', JSON.stringify(meetingsObject));
});
