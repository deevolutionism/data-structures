import serial
import time
ser = serial.Serial('/dev/ttyACM0',9600)
f = open('poopdata.txt','w')
while 1:
    if ser.inWaiting():
        x=ser.read()
        t=time.time();
        print(x)
        f.write(t)
        if(t=='/n'):
            f.seek(0)
            f.truncate()
        f.flush()
f.close()
ser.close()
