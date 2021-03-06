function randomInRange(min, max) {
  return Math.random() * (max-min) + min;
}

var map;
var markers = [];
var windows = [];
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.9306863,
      lng: -75.1660835
    },
    zoom: 14
  });

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    // var addr = places[0].formatted_address;
    console.log(places[0]);
    var loc = places[0].geometry.location;
    var addr = loc.G + ',' + loc.K;

    $.get('/directions?origin=wells%20fargo%20center%20philadelphia&destination=' + addr).then(function(data) {

      if (window.lastPath) {
        window.lastPath.setMap(null);
      }

      var polyline = data.routes[0].overview_polyline.points;
      console.log(data);
      var path = new google.maps.Polyline({
        path: google.maps.geometry.encoding.decodePath(polyline),
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: map
      });
      window.lastPath = path;
    });

  });


  everyblock.map(function(el) {
    var position = {
      // lat: parseFloat(el.latitude),
      // lng: parseFloat(el.longitude)
      lat: randomInRange(39.939681, 39.963030),
      lng: randomInRange(-75.181942, -75.143820)
    };

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: el.title + '\n' + el.type,
      icon: randImg()
    });

    var infowindow = new google.maps.InfoWindow({
      content: '<h2>' + el.title + '</h2>' + el.type + '<br />'
        + el.location + '<br />'
        + '<a href="' + el.url + '" target="_blank">View on EveryBlock</a>'
    });
    windows.push(infowindow);

    marker.addListener('click', function() {
      windows.map(function(w) {
        w.close();
      });
      infowindow.open(map, marker);
    });

  });

  // This event listener will call addMarker() when the map is clicked.
  map.addListener('click', function(event) {
    addMarker(event.latLng);
  });


  $.get('/pois').then(function(data) {
    data.map(function(el) {
      var position;

      if (typeof el.latitude === 'string') {
        position = {
          // lat: parseFloat(el.latitude),
          // lng: parseFloat(el.longitude)
          lat: randomInRange(39.91806, 39.933564),
          lng: randomInRange(-75.18108, -75.145319)
        };
      } else {
        position = {
        };
      }

      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: el.title + '\n' + el.type,
        icon: imgFromType(el.type)
      });

      var infowindow = new google.maps.InfoWindow({
        content: '<h2>' + el.title + '</h2>' + el.type
      });
      windows.push(infowindow);

      marker.addListener('click', function() {
        windows.map(function(w) {
          w.close();
        });
        infowindow.open(map, marker);
      });

    });
  });

	function addMarker(el) {
	  var marker = new google.maps.Marker({
	    position: el,
	    map: map,
	    title: el.title + '\n' + el.type
	  });
	  markers.push(marker);


	  var infowindow = new google.maps.InfoWindow({
      content: '<div contentEditable="true"><h2>Add Title</h2> Add Type</div>'
    });
	      windows.push(infowindow);

	      marker.addListener('click', function() {
	        windows.map(function(w) {
	          w.close();
	          // if(infowindow.content.includes("Add")){
	          // 	marker.setMap(null);
	          // }
	        });
	        infowindow.open(map, marker);
	      });

	      infowindow.addListener('closeclick', function () {
		 	if (infowindow.content.includes("Add")){
	          marker.setMap(null);
	      	}
	   		});
      infowindow.open(map, marker);


  }

  function imgFromType(type) {
    return './img/' + {
      low_light: 'lowlight',
      sketchy: 'sketchy',
      drugs: 'drugs'
    }[type] + '.png';
  }

  function randImg() {
    var type = ['lowlight', 'sketchy', 'drugs'][Math.floor(Math.random() * 3)];
    return './img/' + type + '.png';
  }

}



