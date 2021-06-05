var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the queryURL
d3.json(queryUrl).then(function (data) {
  var earthquakeData = data.features;

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold the base layer
  var baseMaps = {
    "Light Map": lightmap,
    "Satellite": satellitemap
  };

  // Create overlay object to hold the overlay layer, this messes up my page too
  // var overlayMaps = {
  //   Earthquakes: earthquakes
  // };

  // Create myMap, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap]
  });

  for (var i = 0; i < earthquakeData.length; i++) {
    var earthquake = earthquakeData[i];
    var coord = earthquake.geometry.coordinates

    // 1. get var from data
    var depth = earthquake.geometry.coordinates[2]

    // 2. define var to represent color
    var colorscale = depth;

    // 3. change color based on depth
    if (depth > 25) { colorscale = "red"; }
    else if (depth > 15) { colorscale = "yellow"; }
    else { colorscale = "green"; }

    // 1. get var from data
    var magnitude = earthquake.properties.mag

    // 2. define var to represent size
    var mapRadius = magnitude;

    // 3. change size based on magnitude
    if (magnitude > 2.5) { mapRadius = 10; }
    else if (magnitude > 5.4) { mapRadius = 20; }
    else if (magnitude > 6.0) { mapRadius = 30; }
    else if (magnitude > 6.9) { mapRadius = 40; }
    else { magnitude = 50; }
    L.circleMarker([coord[1], coord[0]], {
      fillOpacity: 0.9,
      color: colorscale,
      fillColor: colorscale,
      radius: mapRadius
    }).addTo(myMap);
  }
  // the markers don't appear in the map and whenever i load this, my page starts blinking
  //   var markerOptions = {
  //   fillOpacity: 0.75,
  //   color: "white",
  //   fillColor: color,
  //   radius: magnitude * 200
  // };
  // L.geoJSON(earthquakeData, {
  //   pointToLayer: function (feature, latlng) {
  //     return L.circleMarker(latlng, markerOptions);
  //   }
  // })

  // Whenever i use the legend, my page no longer works (i got this example from a website)
  // var legend = L.control({position: 'bottomright'});
  // legend.onAdd = function(myMap){
  //   var div = L.DomUtil.create('div','legend');
  //   var labels = ["Magnitude of 0-2.49","Magnitude of 2.5-5.49",
  //     "Magnitude of 5.5-6.09", "Magnitude of 6.1-6.99", "Magnitude of 7.0-7.99"];
  
  // if "magnitude" is in another function, how do i use this for the "mag" variable?
  //   var mag = [100000001,50000001,50000000];
  
  //do i have to create a special div or b in the html or will this override it?
  //   div.innerHTML='<div><b>Legend</b></div';
  //   for(var i = 0; i <mag.length; i++){
  
  //this is where i get lost...
  //     div.innerHTML +='<i style = "background:' + getCountyColor(mag[i]) + '''>&nbsp;</i>&nbsp;&nbsp;'
  //     + labels[i] + '<br/>';
  //   }
  //   return div;
  // }
  // legend.addTo(myMap);

})