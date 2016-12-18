var map;

var getMapData = () => {
  $.ajax({
    type: "GET",
    url: "/latlng",
    dataType: "json",
    async: false,
    success: (data) => {
      console.log(data);
      initialize(data);
    },
    error: (err) => {
      console.log(err);
      return err;
    }
  });
}


var initialize = (data) => {
  var locations = [];
  var names = [];
  var groups = [];
  let windowContent = "";
  for(let i = 0; i < data.result.length; i++){
    locations.push({'lat':data.result[i]._id.lat,'lng':data.result[i]._id.lng});
    names.push(data.result[i].name)
    groups.push(data.result[i]);
  }
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat:40.7831, lng:-73.9712}
  });

  var infowindow = new google.maps.InfoWindow();

  for(var i = 0; i<data.result.length;i++){
    let marker = new google.maps.Marker({
      position: locations[i],
      map: map
    });

    let groups = [];

    for(var j = 0; j < data.result[i].meetingGroups.length; j++){
      groups.push(`
        <p>Name: <b>${data.result[i].meetingGroups[j].groupInfo.name}</b></p>
        <p>Day: <b>${num_to_day(data.result[i].meetingGroups[j].days)}</b></p>
        <p>Time: <b>${data.result[i].meetingGroups[j].times[0]}</b></p>
        `)
    }

    let windowContent = `
      <h1>${data.result[i].meetingGroups[0].groupInfo.address}</h1>
      ${groups}
    `


    marker.addListener('click', () => {
      infowindow.close(); // Close previously opened infowindow
      infowindow.setContent( windowContent );
      infowindow.open(map, marker);
    });

  }
}


var num_to_day = (num) => {
  switch (num.toString()) {
    case '0':
      return 'Sunday'
      break;
    case '1':
      return 'Monday'
      break;
    case '2':
      return 'Tuesday'
      break;
    case '3':
      return 'Wednesday'
      break;
    case '4':
      return 'Thursday'
      break;
    case '5':
      return 'Friday'
      break;
    case '6':
      return 'Saturday'
      break;
    default:
      return undefined
  }
}
