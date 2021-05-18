var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});


// CREATE BASIC MAPS: LIGHT MAP AND SATELLITE MAP
function createMap(earthquakes) {

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

  // Create overlay object to hold the overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create myMap, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  })
    .addTo(myMap);
  
    // I got this from an example in a website 
  // var legend = L.control({position: 'bottomright'});
  // legend.onAdd = function(myMap){
  //   var div = L.DomUtil.create('div','legend');
  //   var labels = ["Magnitude of 0-2.49","Magnitude of 2.5-5.49",
  //     "Magnitude of 5.5-6.09", "Magnitude of 6.1-6.99", "Magnitude of 7.0-7.99"];
      // if "magnitude" is in anither function, how do i use this for the "mag" variable?
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
}

// CREATE EARTHQUAKE FEATURES
function createFeatures(earthquakeData) {

  // For each feature create Popup layer, size and color the marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Magnitude: " + feature.properties.mag +
      "</h3><hr><h3> Location: " + (feature.properties.place) + "</h3><hr><h3> Depth: "
      + (feature.geometry.coordinates[2]) + "</h3>");

    var magnitude = feature.properties.mag
    var depth = feature.geometry.coordinates[2]
    var longitude = feature.geometry.coordinates[0]
    var latitude = feature.geometry.coordinates[1]

    // Conditional coloring of circles based on depth
    var color = "";
    if (depth > 25) { color = "red"; }
    else if (depth > 15) { color = "yellow"; }
    else { color = "green"; }

    // Size the marker based on the magnitude of the earthquake
    
    // i added this from the leaflet website but it doesn't work
    // var circle = L.circle([51.508, -0.11], {
    //   fillOpacity: 0.5,
    //   color: 'red',
    //   fillColor: '#f03',
    //   radius: 500
    // }).addTo(myMap);

    var markerOptions = {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      radius: magnitude * 200
    };
    // the markers don't appear in the map
    L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markerOptions);
      }
    })
  }

  // Create a GeoJSON layer 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature

  });

  // Sending the earthquakes layer to the createMap function
  createMap(earthquakes);
}