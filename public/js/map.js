
var lon = parseFloat(document.getElementById("lon").innerHTML);
var lat = parseFloat(document.getElementById("lat").innerHTML);
// let'c create a map
var baseMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
var map = new ol.Map({
  target: 'map',
  layers: [ baseMapLayer],
  view: new ol.View({
          center: ol.proj.fromLonLat([lon,lat]), 
          zoom: 9 //Initial Zoom Level
        })
});

//Adding a marker on the map
var marker = new ol.Feature({
  geometry: new ol.geom.Point(
    ol.proj.fromLonLat([lon,lat])
  ),  // Cordinates of New York's Town Hall
});
var vectorSource = new ol.source.Vector({
  features: [marker]
});
var markerVectorLayer = new ol.layer.Vector({
  source: vectorSource,
});

map.addLayer(markerVectorLayer);


