var express = require('express');
var url = 'mongodb://localhost:27017/aameetings';
var MongoClient = require('mongodb').MongoClient;
var app = express();
var port = 3001;
app.listen(port, function(){
  console.log('app listening on port ' + port);
});

app.use(express.static('public'));

app.get('/latlng', (req, res) => {
  query( (data) => {
    console.log(data);
    res.send(data);
  });
});


var query = (callback) => {
  var datetimeStart = new Date();
  MongoClient.connect(url, (err, db) => {
    if (err) {return console.dir(err);}

    var collection = db.collection('aagroups_02');

    collection.find({$and: [{'day':'2'},{'time':{$gte:'19:00'}}]}).toArray(function(err, docs) {
        if (err) {console.log(err)}
        else {
          console.log(docs.length);
          callback({'result':docs});
        }
        db.close();
        // noIndex.push(new Date() - datetimeStart);
        // console.log("This process completed in", new Date() - datetimeStart, "milliseconds.");
        // console.log(noIndex);
    });
  });
}
