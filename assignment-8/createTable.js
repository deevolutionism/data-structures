var pg = require('pg');

// connection string
var un = 'litterbox';
var pw = 'litterbox';
var db = 'litterbox';
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = `postgres://${un}:${pw}@${ep}/${db}`;

// var createTableQuery = "CREATE TABLE litterbox (message varchar(100) , dateCreated timestamp DEFAULT current_timestamp);"
// var insertIntoQuery = "INSERT INTO litterbox VALUES ('Cat pooped!', DEFAULT);"
// var query = "SELECT * FROM litterbox;"
// var complexQuery = "SELECT sum(amount) as total FROM litterbox GROUP BY DEFAULT;"

var createTableQuery = "CREATE TABLE test (message varchar(100) , dateCreated timestamp DEFAULT current_timestamp);"
var insertIntoQuery = "INSERT INTO test VALUES ('Test Value', DEFAULT);"
var query = "SELECT * FROM test;"
var complexQuery = "SELECT sum(amount) as total FROM test GROUP BY DEFAULT;"

/* 1.  CREATE TABLE
  pg.connect(conString, (err, client, done) => {
      if (err) {
          return console.error('error fetching client from pool', err);
      }

      client.query(createTableQuery, (err, result) => {
          //call `done()` to release the client back to the pool
          done();

          if (err) {
              return console.error('error running query', err);
          }
          console.log(result);
      });

  });
*/

/* 2. INPUT VALUES
pg.connect(conString, (err, client, done) => {
    if (err) {
        return console.error('error fetching client from pool', err);
    }

    client.query(insertIntoQuery, (err, result) => {
        //call `done()` to release the client back to the pool
        done();
        if (err) {
            return console.error('error running query', err);
        }
        console.log(result);
    });

});
*/

/* 3. QUERY TABLE FOR VALUES
pg.connect(conString, (err, client, done) => {
    if (err) {
        return console.error('error fetching client from pool', err);
    }

    client.query(query, (err, result) => {
        //call `done()` to release the client back to the pool
        done();
        if (err) {
            return console.error('error running query', err);
        }
        console.log(result);
    });

});
*/
