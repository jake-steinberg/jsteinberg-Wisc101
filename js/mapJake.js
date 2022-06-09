let map;
let slider;
let selectedYear = 2020;
let pointLayer;
let geoJson = {
    type: "FeatureCollection",
    name: "storyData",
    features: []
};

function createMap(){
    //create basemap
    map = L.map('wisc-101-map', {
    center: [44.605, -89.865],
    zoom: 6,
    minZoom: 5,
    scrollWheelZoom: false,
    });

    //add the basemap layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoiam1qYW5pc2NoIiwiYSI6ImNreXZ4Y3pkOTAzMjIydXB0bTV1YWt6bnQifQ.EGsVeEHL4CXEMnk2zF1_xA'
    }).addTo(map);

    //add attribution
    let openStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '<a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }).addTo(map);

    let wiscGeojson = L.geoJson(wiscBoundary, {
        style: {color: 'black', weight: '.7', fillOpacity: 0}
    }).addTo(map);

    createSlider();
    getData();
};

function createSlider(){
    slider = document.getElementById("time-slider");
    let sliderOutput = document.getElementById("slider-output");
    sliderOutput.innerHTML = selectedYear;
    slider.value = selectedYear;

    slider.oninput = function () {
        selectedYear = this.value;
        sliderOutput.innerHTML = selectedYear;
        updateData();
    };
};

//function to retrieve the data and place it on the map
function getData(){
    Papa.parse('data/storyData.csv', {
        download: true,
        header: true,
        complete: results => {
            results.data.forEach(function(data){
               if(data.timelineStart && data.timelineEnd){
                   let feature = {}
                   feature.type = "Feature";
                   feature.properties = {};
                   feature.geometry = {
                       type: "Point",
                       coordinates: [parseFloat(data.Longitude), parseFloat(data.Latitude)]
                   };
                   for (const property in data){
                       feature.properties[property] = data[property];
                   }
                geoJson.features.push(feature)
               }
            });
            addData();
        }
    })
};

function addData(){
    pointLayer = L.geoJson(geoJson,{
        onEachFeature:function(feature, layer){
        }
    }).addTo(map)
};

function updateData(){
    if (pointLayer){
        map.removeLayer(pointLayer)
    }

    pointLayer = null;
    
    pointLayer = L.geoJson(geoJson,{
        onEachFeature:function(feature, layer){
        },
        filter:function(feature){
            if (feature.properties.timelineStart <= selectedYear && (feature.properties.timelineEnd >= selectedYear))
                return true
            else
                return false
        }
    }).addTo(map)
};

function setMapMarkers(){

};


document.addEventListener('DOMContentLoaded',createMap);