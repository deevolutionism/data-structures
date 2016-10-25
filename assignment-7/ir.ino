#include <Adafruit_NeoPixel.h>

#define PIN 1
#define     IR_LED                 0         // Digital pin that is hooked up to the IR LED.
#define     IR_SENSOR              2     
#define     BASKET_CHECK_SECONDS   0.1  //How often it checks to see if there is a ball.
unsigned long startTime;
unsigned long endTime;
boolean recording;
///////////////////////////////////////////////////////
// Setup function
//
// Called once at start up.
///////////////////////////////////////////////////////
void setup(void){
  recording = false;
  // Set up the input and output pins.
  pinMode(IR_LED, OUTPUT);
  pinMode(IR_SENSOR, INPUT);
  Serial.begin(9600);
  
}

///////////////////////////////////////////////////////
// Loop Function
//
// Called continuously after setup function.
///////////////////////////////////////////////////////
void loop(void) {
  if (isBallInHoop()) {  
//    Serial.println("activity detected");
      if(recording == false){
        recording = true; //start recording time
        timer();
      }
  } else {
      if(recording == true){
      Serial.println("Duration:");
      Serial.println(millis() - startTime); //get duration
      recording = false; //stop recording time
      }
//    Serial.println("no activity");
  }
  
  // Delay for 100 milliseconds so the ball in hoop check happens 10 times a second.
  delay(100);
}



///////////////////////////////////////////////////////
// isBallInHoop function
//
// Returns true if a ball is blocking the sensor.
///////////////////////////////////////////////////////
boolean isBallInHoop() {
  // Pulse the IR LED at 38khz for 1 millisecond
//  Serial.println("pulsing IR");
  pulseIR(1000);

  // Check if the IR sensor picked up the pulse (i.e. output wire went to ground).
  if (digitalRead(IR_SENSOR) == LOW) {
//    endTime = millis();
    
    return false; // Sensor can see LED, return false.
  } else {
//    startTime = millis();
  }
  
  return true; // Sensor can't see LED, return true.
}

///////////////////////////////////////////////////////
// pulseIR function
//
// Pulses the IR LED at 38khz for the specified number
// of microseconds.
///////////////////////////////////////////////////////
void pulseIR(long microsecs) {
  // 38khz IR pulse function from Adafruit tutorial: http://learn.adafruit.com/ir-sensor/overview
  
  // we'll count down from the number of microseconds we are told to wait
 
  cli();  // this turns off any background interrupts
 
  while (microsecs > 0) {
    // 38 kHz is about 13 microseconds high and 13 microseconds low
   digitalWrite(IR_LED, HIGH);  // this takes about 3 microseconds to happen
   delayMicroseconds(10);         // hang out for 10 microseconds, you can also change this to 9 if its not working
   digitalWrite(IR_LED, LOW);   // this also takes about 3 microseconds
   delayMicroseconds(10);         // hang out for 10 microseconds, you can also change this to 9 if its not working
 
   // so 26 microseconds altogether
   microsecs -= 26;
  }
 
 
 
  sei();  // this turns them back on
  

  
  }

  void timer() {
    startTime = millis();
    Serial.println("activity start:");
    Serial.println(startTime);
  }


