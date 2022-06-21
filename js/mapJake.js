let map;
let slider;
let selectedYear = 2020;
let pointLayer;
let geoJson = {
    type: "FeatureCollection",
    name: "storyData",
    features: []
};

//change marker to custom icon
L.Marker.prototype.options.icon = L.icon({
    iconUrl: 'img/wisc101_icon.png',
    iconSize: [20, 25],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14],
});

function createMap(){
    //create basemap
    map = L.map('wisc-101-map', {
    center: [44.605, -89.865],
    zoom: 7,
    minZoom: 7,
    scrollWheelZoom: false,
    maxBounds: [
        [48, -96],
        [41, -83]
        ]
    });

    //add the basemap layer
    L.tileLayer('https://api.mapbox.com/styles/v1/jakesteinberg/ck0i9rn690a6r1cqpjs37sokh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFrZXN0ZWluYmVyZyIsImEiOiJjanVtbzhwa2kxNTlsM3ltcXA0aGtiMDliIn0.2Q6HfVv2bholtzkLAhhHnw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        subdomains: 'abcd'
    }).addTo(map);

    //create the slider filter
    createSlider();
    //load the data onto the map
    getData();
};

//function to create the slider filter
function createSlider(){
    slider = document.getElementById("time-slider");
    let sliderOutput = document.getElementById("slider-output");
    sliderOutput.innerHTML = selectedYear;
    slider.value = selectedYear;

    //event listener to update selectedYear when the user changes the slider position
    slider.oninput = function () {
        selectedYear = this.value;
        sliderOutput.innerHTML = selectedYear;
        //update the displayed data to correspond with selectedYear
        updateData();
    };
};

//function to retrieve the data and place it on the map
function getData(){
    //Papaparse library reads csvs - more info here: https://www.papaparse.com/
    Papa.parse('data/storyData.csv', {
        download: true,
        header: true,
        complete: results => {
            results.data.forEach(function(data){
               //filters data to only include data with values in the timelineStart and timelineEnd columns
               if(data.timelineStart && data.timelineEnd){
                   //creates feature to contain story data
                   let feature = {}
                   feature.type = "Feature";
                   feature.properties = {};
                   feature.geometry = {
                       type: "Point",
                       coordinates: [parseFloat(data.Longitude), parseFloat(data.Latitude)]
                   };
                   //for loop turns csv columns into feature properties
                   for (const property in data){
                       feature.properties[property] = data[property];
                   }
                //pushes feature into geoJson created at the beginning of the script
                geoJson.features.push(feature)
               }
            });
            //add data to the map
            addData();
        }
    })
};

//function to add data to the map
function addData(){
    pointLayer = L.geoJson(geoJson,{
        onEachFeature:function(feature, layer){
            return onEachFeature(feature, layer)
        }
    })
    .addTo(map);
};

//function to bind popups to points
function onEachFeature(feature, layer){
    //create new popup content
    var popupContent = new popUpContent(feature.properties);

    //bind the popup to the  marker    
    layer.bindPopup(popupContent.formatted);

    //return the marker to the L.geoJson pointToLayer option
    return layer;
};

//fucntion to define the pop up content
function popUpContent(properties){
    this.properties = properties;
    this.formatted  = "<p><b>" + properties.History + "</b></p>" + 
                      "<p style='width: 100%; text-align: center'><a href='" + properties['Permanent Link'] + "'>View Story</a></p>"
    };

//function to filter the data based on the slider position
function updateData(){
    //removes story data points from map in order to re-add them
    if (pointLayer){
        map.removeLayer(pointLayer)
    }

    //sets the default pointLayer to not appear
    pointLayer = null;
    
    //adds story map data to the map if it fits timeline condition
    pointLayer = L.geoJson(geoJson,{
        onEachFeature:function(feature, layer){
            return onEachFeature(feature, layer)
        },
        filter:function(feature){
            //adds data if selectedYear is greater than or equal to timelineStart and less than or equal to timelineEnd
            if (feature.properties.timelineStart <= selectedYear && (feature.properties.timelineEnd >= selectedYear))
                return true
            else
                return false
        }
    }).addTo(map)
};

document.addEventListener('DOMContentLoaded',createMap);