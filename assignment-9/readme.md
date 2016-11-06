# Overview
The IR and LED sensor were placed on opposite sides of the litter box walls. Every time the cat uses the litter box, it breaks the IR connection. An Arduino notifies a Raspberry Pi, which then records the time of the event and stores it in a file. That file was read and put into the Postgres database after a week of data collection.

# Issues
Ideally, I would have liked to have the Raspberry Pi interact directly with the database, but node was a nightmare to configure and Johnny-Five had some issues with its serial port dependency. Instead, I used python to read and write Arduino serial data to file for post-processing.

# Data
Recorded in epoch format. Lightweight and easy for javascript to interpret.
```
1477808397
1477852056
1477906244
1477975416
1478034655
1478078894
1478112432
1478193094
1478228059
1478269375
1478344549
```


# Query Result:

```
Result {
  command: 'SELECT',
  rowCount: 13,
  oid: NaN,
  rows:
   [ anonymous { timelitterboxused: 1477808397 },
     anonymous { timelitterboxused: 1477808397 },
     anonymous { timelitterboxused: 1477808397 },
     anonymous { timelitterboxused: 1477852056 },
     anonymous { timelitterboxused: 1477906244 },
     anonymous { timelitterboxused: 1477975416 },
     anonymous { timelitterboxused: 1478034655 },
     anonymous { timelitterboxused: 1478078894 },
     anonymous { timelitterboxused: 1478112432 },
     anonymous { timelitterboxused: 1478193094 },
     anonymous { timelitterboxused: 1478228059 },
     anonymous { timelitterboxused: 1478269375 },
     anonymous { timelitterboxused: 1478344549 } ],
  fields:
   [ Field {
       name: 'timelitterboxused',
       tableID: 16415,
       columnID: 1,
       dataTypeID: 23,
       dataTypeSize: 4,
       dataTypeModifier: -1,
       format: 'text' } ],
  _parsers: [ [Function: parseInteger] ],
  RowCtor: [Function: anonymous],
  rowAsArray: false,
  _getTypeParser: [Function: bound ] }
  ```
