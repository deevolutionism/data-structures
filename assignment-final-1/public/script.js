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
  for(let i = 0; i < data.result.length; i++){
    locations.push({'lat':data.result[i].lat,'lng':data.result[i].long});
    names.push(data.result[i].name)
  }
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat:40.7831, lng:-73.9712}
  });
  for(var i = 0; i<locations.length;i++){
    let marker = new google.maps.Marker({
      position: locations[i],
      map: map
    });
    let infowindow = new google.maps.InfoWindow({
      content: names[i]
    });
    marker.addListener('click', () => {
    infowindow.open(map, marker);
  });
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

  // var displayMapPin = (data) => {
  //   console.log(data);
  //   let marker = new google.maps.Marker({
  //     position: new google.maps.LatLng(data.locations[j].lat, data.locations[j].long),
  //     map: map
  //   });
  // }
  //
  // var makeMapPin = (data) => {
  //   console.log('?')
  //   return () => {
  //     console.log('something??');
  //     displayMapPin(data);
  //   }
  // }

  // for( i = 0; i < markers.length; i++ ) {
  //       var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
  //       bounds.extend(position);
  //       marker = new google.maps.Marker({
  //           position: position,
  //           map: map,
  //           title: markers[i][0]
  //       });
  //
  //       // Allow each marker to have an info window
  //       google.maps.event.addListener(marker, 'click', (function(marker, i) {
  //           return function() {
  //               infoWindow.setContent(infoWindowContent[i][0]);
  //               infoWindow.open(map, marker);
  //           }
  //       })(marker, i));
  //
  //       // Automatically center the map fitting all markers on the screen
  //       map.fitBounds(bounds);
  //   }




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
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i].name
        });

        // Allow each marker to have an info window
        // google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //     return function() {
        //         infoWindow.setContent(marker[i].name);
        //         infoWindow.open(map, marker);
        //     }
        // })(marker, i));


    }

}
