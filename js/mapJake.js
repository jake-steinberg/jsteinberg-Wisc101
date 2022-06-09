let map;
let slider;
let selectedYear = 2022;

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
    };
};

//function to retrieve the data and place it on the map
function getData(){
    //load the cheetah data
    fetch("data/testData.geojson")
    .then(function(response){
        return response.json();
    }).addTo(map)
    .then(function(json){
        //create an attributes array
        let attributes = processData(json);
        //create the symbols
        //createSymbols(json, attributes);
    });
};

//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    let attributes = [];

    //properties of the first feature in the dataset
    let properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (let attribute in properties){
        attributes.push(attribute);
        };

    return attributes;
};

document.addEventListener('DOMContentLoaded',createMap)