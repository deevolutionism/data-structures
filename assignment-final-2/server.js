var pg = require('pg');
var http = require('http');

// connection string
var un = 'litterbox';
var pw = 'litterbox';
var db = 'litterbox';
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = `postgres://${un}:${pw}@${ep}/${db}`;+ un + ":" + pw + "@" + ep + "/" + db;


// var query = "SELECT timelitterboxused FROM litterbox";
// var query = "SELECT timelitterboxused, date_trunc('month', to_timestamp(timelitterboxused)) FROM litterbox"
// var query = "SELECT TIMESTAMP 'epoch' + timelitterboxused FROM litterbox * INTERVAL '1 second'";
// var query = "CREATE OR REPLACE VIEW converted AS " +
// "SELECT timelitterboxused, " +
//       "TIMESTAMP 'epoch' + timelitterboxused * INTERVAL '1 second' as ah_real_datetime " +
// "FROM litterbox";

//var query = "SELECT to_timestamp(timelitterboxused) FROM litterbox GROUP BY timelitterboxused";
//get all the times => group them by day =>
// var query = "SELECT count(*), to_timestamp(timelitterboxused) as datelitterboxused FROM litterbox GROUP BY datelitterboxused"
var query = "SELECT count(*), date_trunc('day', to_timestamp(timelitterboxused)) as datelitterboxused FROM litterbox GROUP BY datelitterboxused"


var server = http.createServer(function(req, res) {

    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(query, function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }

            res.writeHead(200, {'content-type': 'application/json'});
            res.end(JSON.stringify(result.rows));

        }); // client.query

    }); // pg.connect

}); // server

server.listen(process.env.PORT || 8000);
