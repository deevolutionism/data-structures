import serial
ser = serial.Serial('/dev/ttyACM0',9600)
f = open('poopdata.txt','w')
while 1:
    if ser.inWaiting():
        x=ser.read()
        print(x)
        f.write(x)
        if(x=='/n'):
            f.seek(0)
            f.truncate()
        f.flush()
f.close()
ser.close()
           
    
    
