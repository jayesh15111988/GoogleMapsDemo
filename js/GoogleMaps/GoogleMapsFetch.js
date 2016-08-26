var mapOptions;
var map;
var currentMarkerIndex;
var markers = [];
var bounds;
var defaultZoomLevel=6;
var selectedInfoWindow;

var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
};

function initialize() {
    bounds = new google.maps.LatLngBounds();
    mapOptions = {
        zoom: defaultZoomLevel
    };

    //Initialize new maps with initial options set
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

function addMarkerOnMap() {

    //<mapCoordinatesAndInfoHolderArray> holds the specific location and specially all location details
    //We will separate it out and display on the view port

    var currentLocationToMarkOnMap = mapCoordinatesAndInfoHolderArray[currentMarkerIndex];

    //Convert retrieved Latitude and longitudes to Google Maps layLong Object

    var myLatLng = new google.maps.LatLng(currentLocationToMarkOnMap[1], currentLocationToMarkOnMap[2]);

    //Center the map at current coordinates. Map will readjust itself for each pin being plotted on the map

    map.setCenter(myLatLng);

    var pinSize = getRandomArbitrary(10, 36);
    var image = {
        url: "../GoogleMapsDemo/images/location.png",
        scaledSize: new google.maps.Size(pinSize, pinSize)
    };

    var contentString = "This is info for zip code "+ collectionOfAllGoogleMapsMetaData[currentMarkerIndex] + " and count is " + pinSize;

    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        shape: shape,
        zIndex: currentLocationToMarkOnMap[3],
        icon: image
    });

    marker.addListener('click', function() {
        if (selectedInfoWindow != null && selectedInfoWindow.getMap() != null) {
            selectedInfoWindow.close();
            if (selectedInfoWindow == infoWindow) {
                selectedInfoWindow = null;
                return;
            }
        }
        selectedInfoWindow = infoWindow;
        selectedInfoWindow.open(map, marker);
    });

    markers.push(marker);
    currentMarkerIndex++;
    bounds.extend(myLatLng);
    map.fitBounds(bounds);
}

function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}


function plotPinsOnMapWithGoogleMapsLocationsInformation() {
    currentMarkerIndex = 0;
    for (var i = 0; i < mapCoordinatesAndInfoHolderArray.length; i++) {
        addMarkerOnMap();
    }
    map.fitBounds(bounds);
}

//Beofre plotting new coordinates make sure we remove all markers from previous mappings
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function clearMarkers() {
    setAllMap(null);
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

google.maps.event.addDomListener(window, 'load', function() {
    initialize();
    sendRequestToGetListAndPlotAllMapPointOnMapWithGoogleMapsName();
});