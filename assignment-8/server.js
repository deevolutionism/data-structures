var pg = require('pg');

// connection string
var un = 'litterbox'
var pw = 'litterbox'
var db = 'litterbox'
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = `postgres://${un}:${pw}:${@}:${ep}/${db}`;

var createTableQuery = "CREATE TABLE wham (message varchar(100) , dateCreated timestamp DEFAULT current_timestamp, whammy boolean, amount smallint);"
var insertIntoQuery = "INSERT INTO wham VALUES ('No whammy!!!', DEFAULT, FALSE, 100);"
var query = "SELECT * FROM wham;"
var complexQuery = "SELECT sum(amount) as total FROM wham GROUP BY whammy;"

pg.connect(conString, function(err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
    }

    client.query(complexQuery, function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
            return console.error('error running query', err);
        }
        console.log(result);
    });

});
