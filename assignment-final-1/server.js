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
  aggregate( (data) => {
    res.send(data)
  });
});

/*
EXAMPLE OUTPUT JSON
{
  'location': 'utica ave, brooklyn ny, 11233',
  'geometries': {
    'lat':90.12345,
    'lng':75.12345
  },
  'groups': [
    {
      'name':'group1',
      'notes':'blah blah',
      'borough':'manhattan'
      'day':[
        'tuesday',
        'wednesday'
      ],
      'times':[
        08:00 PM,
        11:00 PM,
        2:00 AM
      ],
      'types':[
        'closed',
        'open'
      ]

    },
    {
      'name':'group2',
      'notes':'blah blah',
      'borough':'manhattan'
      'times': [
        10:00 AM,
        12:00 PM,
        4:00 PM
      ],
      'types':[
        'closed'
    ]

    }
  ]
}
*/

/*
DB AGGREGATE QUERY
db.aagroups_02.aggregate([ {$match: {$and:[{day:"0"},{time:"08:00"}]} } ])
*/

var aggregate = (callback) => {
  var datetimeStart = new Date();
  var d = datetimeStart.getDay();
  var h = datetimeStart.getHours();
  console.log(`day:${d} + hour:${h}`);
  MongoClient.connect(url, (err, db) => {
    if (err) {return console.dir(err);}

    var collection = db.collection('aagroups_02');

    collection.aggregate([
      //match - find all meetings happening from now until 4am tomorrow
      {
        $match: {
          $or: [
            {$and: [
              {day:d.toString()},
              {time: {$gte:getHour(h)} }
            ]},
            {$and: [
              {day: nextDay(d).toString()},
              {time: {$lte:'04:00'}}
            ]}
          ]
        }
      },

      //group - meeting names
      {
        $group: {
          _id : {
            lat: "$lat",
            lng: "$long",
            name: "$name",
            region: "$region",
            address: "$formatted_address",
            link: "$link"
          },
          days: { $push: "$day"},
          times: { $push: "$time"},
          types: { $push: "$tye"}
        }
      },

      //group - meetings which share location together
      {
        $group: {
          _id : {
            lat: "$_id.lat",
            lng: "$_id.lng",
          },
          meetingGroups: {
            $push: {
              groupInfo: "$_id",
              days: "$days",
              times: "$times",
              types: "$types"
            }
          }
        }
      }

    ]).toArray( (err, docs) => {
      if(err) {console.log(err)}
      else {
        console.log(docs);
        callback({'result':docs});
      }
    });

  });
}


var getHour = (hour) => {
  if(hour < 10){
    var h = `0${hour}:00`;
    return h
  } else {
    var h = `${hour}:00`;
    return h
  }
}

var nextDay = (day) => {
  return day+1;
}
