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
      'name':'group1'
      'time':08:00,
      'day':2
    },
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
      {
        $match: {
          $and: [
            {day:d.toString()},
            {time: {$gte:getHour(h)} }
          ]
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
