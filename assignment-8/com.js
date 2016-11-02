var five = require("johnny-five"),
  reciever, led;

five.Board().on("ready", function() {

  reciever = new five.Sensor(2);
  led = new five.Led(4);

  //check the litterbox once every second
  setInterval(()=>{isCatPooping();},10);




});

var isCatPooping = () => {
  //function that pulses the IR LED
  //and checks reciever for response
  pulseIR(1000); //pulse IR for 1 ms
  reciever.on('change', (value) => {
    // console.log(value);
  });
}

console.log(process.hrtime());

var pulseIR = (microseconds) => {
  // let start = process.hrtime();

  if(microseconds > 0){
  //turn LED on for 10 seconds
  led.toggle()
  //turn it off for 10 seconds
  microseconds -= 13;
  setTimeout(function(){pulseIR(microseconds);},10);
  }
}
