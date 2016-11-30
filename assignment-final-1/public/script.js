var map;

var getMapData = () => {
  $.ajax({
    type: "GET",
    url: "/latlng",
    dataType: "json",
    async: false,
    success: (data) => {
      console.log(data);
      // initMap(data);
      // initialize(data);
      example(data);
    },
    error: (err) => {
      console.log(err);
      return err;
    }
  });
}


var example = (data) => {
  var locations = [];
  var names = [];
  var groups = [];
  for(let i = 0; i < data.result.length; i++){
    locations.push({'lat':data.result[i].lat,'lng':data.result[i].long});
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

    let windowContent = `
      <h1>${data.result[i].name}</h1>
      <ul>
        <li>${data.result[i].time}</li>
        <li>${data.result[i].location}, ${data.result[i].formatted_address}</li>
        <li>${data.result[i].type}</li>
        <li><a href=${data.result[i].link}>${data.result[i].link}</a></li>
        <li>${num_to_day(data.result[i].day)}</li>
      </ul>
    `

    marker.addListener('click', () => {
      infowindow.close(); // Close previously opened infowindow
      infowindow.setContent( windowContent );
      infowindow.open(map, marker);
    });

  }
}


var num_to_day = (num) => {
  switch (num) {
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


var initMap = (data) => {
  var map;
  var locations = [];
  for(let i = 0; i < data.result.length; i++){
    locations.push({'lat':data.result[i].lat,'lng':data.result[i].long});
  }

  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[0].lat,locations[0].lng),
    map: map
  });

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7831, lng: -73.9712},
    zoom: 12
  });

}




var initialize = (data) => {
    var map;
    var markers = [];

    // Display a map on the page
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7831, lng: -73.9712},
      zoom: 12
    });

    // Multiple Markers
    for(var j = 0; j<data.result.length; j++){
      markers.push({"lat":data.result.lat,"lng":data.result.long});
    }



    // Display multiple markers on a map
    // var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
      console.log(markers[i])
        var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);

        let infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i].name
        });

    }

}
