var five = require("johnny-five");
var pg = require('pg');

// connection string
var un = 'litterbox';
var pw = 'litterbox';
var db = 'litterbox';
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = 'postgres://' + un + ':' + pw + '@' + ep + '/' + db;


var createTableQuery = "CREATE TABLE litterbox (message varchar(100) , dateCreated timestamp DEFAULT current_timestamp);"
var insertIntoQuery = "INSERT INTO litterbox VALUES ('Cat pooped!', DEFAULT);"
var query = "SELECT * FROM litterbox;"
var complexQuery = "SELECT sum(amount) as total FROM litterbox GROUP BY DEFAULT;"

//initialize arduino
var board = new five.Board();

var led, reciever, previous;

board.on("ready", function() {

  //initialize IRLED and IRRECIEVER
  led = new five.Led(5);
  reciever = new five.Button(2);
  previous = 0;

  //activate IRLED every 10 milliseconds
  setInterval( function(){ ledON() }, 10);

  //check IRRECIEVER for litterbox activity
  reciever.on('press', function() {
    var current = new Date;
    console.log(`Cat used the litter box at ${current}`);

    var diff = current.getTime() - previous
    if(diff > 10*60000){
      insertIntoQuery = `INSERT INTO litterbox VALUES ('TEST',DEFAULT);`
      //eliminates chance of erroneous data entering the db
      pg.connect(conString, function(err, client, done) {
          if (err) {
              return console.error('error fetching client from pool', err);
          }

          client.query(insertIntoQuery, function(err, result) {
              //call `done()` to release the client back to the pool
              done();

              if (err) {
                  return console.error('error running query', err);
              }
              console.log(result);
          });

      });
    }
    previous = current; // log this as the last data collection
  });
});

var ledON = function(microseconds) {
  //~38kh
  led.on();
  microseconds -= 13;
  if(microseconds > 0){
    setTimeout(function(){ ledOFF(microseconds) }); //on for 13 microseconds
  }
}

var ledOFF = function(microseconds) {
  //~38kh
  led.off();
  microsecons -= 13;
  setTimeout( function(){ ledON(microseconds) }); //off for 13 mincroseconds
}
