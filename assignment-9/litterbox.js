var pg = require('pg');
var fs = require('fs');

// connection string
var un = 'litterbox'
var pw = 'litterbox'
var db = 'litterbox'
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = `postgres://${un}:${pw}@${ep}/${db}`;

// temporary storage
var litterboxUseTimes = [];

//read data from the file the raspberry pi spit out
fs.readFile('data/data.txt', 'utf8', (err,data) => {
  var uses = data.split('\n');
  uses.forEach( (use) => {
    litterboxUseTimes.push(parseInt(use));
  });
  console.log(litterboxUseTimes);
  insert(0);
});

//insert into database
var insert = (num) => {
  pg.connect(conString, (err, client, done) => {
      if (err) {
          return console.error('error fetching client from pool', err);
      }
      var insertIntoQuery = `INSERT INTO litterbox VALUES (${litterboxUseTimes[num]})`;
      client.query(insertIntoQuery, (err, result) => {
          //call `done()` to release the client back to the pool
          done();

          if (err) {
              return console.error('error running query', err);
          }
          console.log(result);
          if( num < litterboxUseTimes.length){
            num++;
            insert(num);
          }
      });
  });
}

//retrieve from database
var retrieve = () => {
	pg.connect(conString, (err, client, done) => {
      if (err) {
          return console.error('error fetching client from pool', err);
      }
      var query = "SELECT * FROM litterbox;"
      client.query(query, (err, result) => {
          //call `done()` to release the client back to the pool
          done();

          if (err) {
              return console.error('error running query', err);
          }
          console.log(result);
      });
  });
}
