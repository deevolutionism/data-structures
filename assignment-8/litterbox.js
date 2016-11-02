var five = require("johnny-five");
var pg = require('pg');

// connection string
var un = 'litterbox'
var pw = 'litterbox'
var db = 'litterbox'
var ep = 'litterbox.cd9twrbg1o5s.us-west-2.rds.amazonaws.com:5432';
var conString = `postgres://${un}:${pw}@${ep}/${db}`;

var createTableQuery = "CREATE TABLE litterbox (message varchar(100) , dateCreated timestamp DEFAULT current_timestamp);"
var insertIntoQuery = "INSERT INTO litterbox VALUES ('Cat pooped!', DEFAULT);"
var query = "SELECT * FROM litterbox;"
var complexQuery = "SELECT sum(amount) as total FROM litterbox GROUP BY DEFAULT;"

//initialize arduino
var board = new five.Board();

var led, reciever, previous;



board.on("ready", () => {

  //initialize IRLED and IRRECIEVER
  led = new five.Led(5);
  reciever = new five.Button(2);
  previous = 0;

  //activate IRLED pulses every 10 milliseconds
  setInterval( () => { ledON() }, 10);

  //check IRRECIEVER for litterbox activity
  reciever.on('press', () => {
    let current = new Date;
    console.log(`Cat used the litter box at ${current}`);

    let diff = current.getTime() - previous;
    // assume the cat will be moving around in the litterbox
    // and ignore any additional sensor triggers until
    // more than 10 minutes have passed between the previous
    // trigger and the current trigger
    if(diff > 10*60000){
      insertIntoQuery = `INSERT INTO litterbox VALUES ('pooped',DEFAULT);`
      console.log(diff);
      console.log(current);
      eliminates chance of erroneous data entering the db
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
    }
    previous = current.getTime(); // log this as the last data collection
  });
});

var ledON = (microseconds) => {
  //~38kh
  led.on();
  microseconds -= 13;
  if(microseconds > 0){
    setTimeout(()=>{ ledOFF(microseconds) }); //on for 13 microseconds
  }
}

var ledOFF = (microseconds) => {
  //~38kh
  led.off();
  microsecons -= 13;
  setTimeout( () => { ledON(microseconds) }); //off for 13 mincroseconds
}
