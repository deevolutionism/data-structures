# Latency Test
latency measured in milliseconds

latency without indexing the aagroups_02 collection:
![graphic showing latency in ms of 25 identical mongodb queries]
(data/noIndex.png)

latency with an index of the aagroups_02 collection:
![graphic showing latency in ms of 25 identical mongodb queries]
(./data/withIndex.png)

surprisingly, indexed queryies were slower to complete than non-indexed queries. :neutral_face: 

# Example Query
`collection.find({$and: [{'day':'2'},{'time':{$gte:'19:00'}}]})`

# Example document output

`
{
  _id: 57f5d1c7fabc11302d4df709,
  location: 'Plymouth Church',
  address: '75 Hicks Street',
  type: 'Open, Topic Discussion',
  name: 'Cobble Hill',
  link: 'http://meetings.nyintergroup.org/meetings/cobble-hill?d=any&v=list',
  time: '19:45',
  region: 'Brooklyn Heights',
  lat: 40.6993293,
  long: -73.99372269999999,
  formatted_address: '75 Hicks St, Brooklyn, NY 11201, USA',
  day: '2'
 }
 `
