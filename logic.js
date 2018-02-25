//Create the function to determine marker size base on eartkquake magnitude.
function getColor(d) {
  return d > 5  ? '#E31A1C' :
         d > 4  ? '#FC4E2A' :
         d > 3   ? '#FD8D3C' :
         d > 2   ? '#FEB24C' :
         d > 1   ? '#FED976' :
                    '#FFEDA0';
}


// Store the API endpoint inside the queryURL.

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryURL, function(data){
//CreateFeatures object for the Create features function.
createFeatures(data.features);
});

function createFeatures(earthquakeData) {
function onEachFeature(feature, layer) {
  layer.bindPopup("<h2>" + feature.properties.place + 
  "<h3><hr><p>" + new Date(feature.properties.time) + "<p>" );
}

var earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature, 
  pointToLayer: pointToLayer
});

//Sending the earthquakes layer to the createMap function.
createMap(earthquakes);

   function pointToLayer(feature,latlng){
     return new L.circle(latlng,{
       stroke:false,
    fillOpacity: 0.7,
    //color:"blue",
    fillColor:getColor(feature.properties.mag),
    radius: feature.properties.mag * 25000


     })

   }
  
}

function createMap(earthquakes) {
//Define outdoor and satellite map layers.
var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NDg1bDA1cjYzM280NHJ5NzlvNDMifQ.d6e-nNyBDtmQCVwVNivz7A");
  
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10.html/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NDg1bDA1cjYzM280NHJ5NzlvNDMifQ.d6e-nNyBDtmQCVwVNivz7A");

  //Define a baseMaps object to hold the baselayers.
  var baseMaps = {
    "Outdoor Map":outdoorMap,
    "Satellite Map":satelliteMap
  };

  //Create an overlay object to hold the overlay layer.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //Create the map giving it the outdoormak and earthquake layers to display the map on load.
  var myMap = L.map("map",{
    center: [37.09, -95.71],
    zoom: 5,
    layers:[outdoorMap, earthquakes]
  });

  //Add the control layer to the map
  L.control.layers(baseMaps,overlayMaps,{
    collapse: false
  }).addTo(myMap);
  
  //Adding a legend to the map.
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [1,2,3,4,5],
      labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);

};  