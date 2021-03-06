var pg = require('pg');

// connection string
var un = 'litterbox'
var pw = 'litterbox'
var db = 'litterbox'
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = `postgres://${un}:${pw}@${ep}/${db}`;

var query = "SELECT * FROM litterbox;"

//this queries the database
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
