# Final Assignment 2
### Collecting, storing, and sharing sensor data.

For this final assignment, I collected data on my cat's litter box usage throughout the week.

I didn't want to invade my cats privacy nor did I want to have to be next to the litterbox 24/7 so I decided to hook up the arduino and its ir/ir reciever peripherals to a raspberry pi. The data was saved to a text file which was later input to AWS mySQL relational database.

#### Parts diagram
![setup diagram](catveilance.png)

#### Setup
![setup documentation](litterbox_doc.png)

#### Heroku deployment

##### [Heroku App](https://litterboxtracker.herokuapp.com/)

![heroku deployment](deployment.png)

#### Interface mockup
The data from the backend is packaged so that each day is paired with the total number of litter box uses. That count can then be used to color the diagram, where each box represents a day of the week from Monday through Sunday. The time frame is derived from the beginning and end dates provided by the API.
![Possible interface](litterbox_interface_mockup-01.png)
