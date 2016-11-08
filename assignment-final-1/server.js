var express = require('express');
var url = 'mongodb://localhost:27017/aameetings';
var MongoClient = require('mongodb').MongoClient;
var app = express();
var port = 3000;
app.listen(port, function(){
  console.log('app listening on port ' + port);
});

app.use(express.static('public'));

app.get('/latlng', (req, res) => {
  console.log('processing request . . . ');
  query2( (data) => {
    res.send(data)
  });
  // res.send(query2());
});

/*
{
  'location': 'utica ave, brooklyn ny, 11233',
  'geometries': {
    'lat':90.12345,
    'lng':75.12345
  },
  'groups': [
    {
      'name':'group1'
      'time':08:00,
      'day':2
    },
  ]
}
*/



var aggregate = (callback) => {
  var datetimeStart = new Date();
  var hour = datetimeStart.getHours();
  console.log(datetimeStart.getDay());
  hour = hour + ':00';
  console.log(hour);
  MongoClient.connect(url, (err, db) => {
    if(err){return console.dir(err)}
    var collection = db.collection('aagroups_02');
    collection.aggregate([
      { $match : { time: { $gte: hour }, day: toString(datetimeStart.getDay()) } },
    ]).toArray((err, docs) => {
      if(err) {console.log(err)}
      else {
        console.log(docs);
        var locations = {}
        docs.forEach((meetinggroup)=>{
          //loop through each location to check if it already exists
          for(var j = 0; j<locations.length;j++){

            //the meeting group already exists at this location, so
            //first, check if the meeting time for that group has been added.
            if(meetinggroup.formatted_address == locations[j].address){

              //
              if(locations[j].groups.name !== meetinggroup.name){
                locations[j].groups.push({
                  'name':location.name,
                  'type':location.type,
                  'time':[location.time]
                });
              } else {

              }

            } else {
              //location doesn't exist yet, add it.
              locations.push({
                'address':location.formatted_address,
                'geometries':{'lat':location.lat,'lng':location.lng},
                'groups':[
                  {
                    'name':location.name,
                    'type':location.type,
                    'time':[location.time]
                  }
                ]
              });
            }
          }
        });
      }
    });
  });
}

// aggregate();

var query = (callback) => {
  var datetimeStart = new Date();
  MongoClient.connect(url, (err, db) => {
    if (err) {return console.dir(err);}

    var collection = db.collection('aagroups_02');

    collection.find({
      $and: [
        {'day':datetimeStart.getDay()},
        {'time':{$gte:datetimeStart.getHours()}}
      ]
    }).toArray( (err, docs) => {
        if (err) {console.log(err)}
        else {
          // console.log(docs.length);
          callback({'result':docs});
        }
        db.close();
        // noIndex.push(new Date() - datetimeStart);
        // console.log("This process completed in", new Date() - datetimeStart, "milliseconds.");
        // console.log(noIndex);
    });
  });
}


var query2 = (callback) => {
  var datetimeStart = new Date();
  MongoClient.connect(url, (err, db) => {
    if (err) {return console.dir(err);}

    var collection = db.collection('aagroups_02');

    collection.find({})
    .toArray( (err, docs) => {
        if (err) {console.log(err)}
        else {
          console.log(docs);
          callback({'result':docs});
        }
        db.close();
    });
  });
}
