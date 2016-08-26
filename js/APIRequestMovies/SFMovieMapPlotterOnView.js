/**
 * Created by jayeshkawli on 9/17/14.
 */

//We will use this array to store metadata for specific location. This information includes but is not limited to

var collectionOfAllGoogleMapsMetaData=[];

//Given each location, we will make request to Google geocoding API to get coordinates.
//We will use this array to hold all those co-ordinate value

var mapCoordinatesAndInfoHolderArray=[];


function sendRequestToGetListAndPlotAllMapPointOnMapWithGoogleMapsName(){

    console.log("Sending Request to server...");

    mapCoordinatesAndInfoHolderArray=[];
    //We may have markers from previous request. Before sending request, we will call this function to
    // get rid of all markers on the current map

    deleteMarkers();

    collectionOfAllGoogleMapsMetaData=["90008", "43201", "02125", "60290", "75201", "94125", "80003"];


    var individualGoogleMapLocationLocationFromDatabase='';

    if(collectionOfAllGoogleMapsMetaData.length>0){

        var promisesCollectionArray=[];

        //For each location we will have to make separate request to Google geo-coding API
        //We will take each URL and create an array of promises for each of this URL

        for(var locationsIndex in collectionOfAllGoogleMapsMetaData){

            //Encoding URL to avoid possible conflict with special character present in the address component such as &

            individualGoogleMapLocationLocationFromDatabase =encodeURIComponent(collectionOfAllGoogleMapsMetaData[locationsIndex]);
            promisesCollectionArray.push(getPromiseWithURLAndParameters(GoolgeMapsBaseURL+"?address="+individualGoogleMapLocationLocationFromDatabase+"&key="+GoogleMapsAuthorizationKey,[]));
        }


        Promise.all(promisesCollectionArray).then(function(returnedLocationCoordinates){

            //Execute this block only if promise has succeeded
            if(returnedLocationCoordinates)
            {
                $("#no-result-error").animate({top:'-44px'});
                for(var locationCoordinatesIndex in returnedLocationCoordinates){



                    if(returnedLocationCoordinates[locationCoordinatesIndex]['status']==='OK'){
                        var individualCoordinateDetail=returnedLocationCoordinates[locationCoordinatesIndex];
                        var locationName = individualCoordinateDetail['results'][0]['formatted_address'];
                        var locationDetails =  individualCoordinateDetail['results'][0]['geometry']['location'];

                        //We are storing it going by sequence - 'Description dictionary', latitude, longitude and z-index of specific pin
                        //Mapped on the given view
                        mapCoordinatesAndInfoHolderArray.push([collectionOfAllGoogleMapsMetaData[locationCoordinatesIndex],locationDetails['lat'],locationDetails['lng'],parseInt(locationCoordinatesIndex+5,10),locationName]);

                    }
                    else{
                        //Somewhere down the line we enountered an error while retrieving Geolocation using Google's
                        //Geocoding APIs. Log this error. In our case, if one prmise fails, it will cause collapse for
                        //All subsequent one and control will eventually reach here

                        console.log("Error In retrieving location with details  "+JSON.stringify(collectionOfAllGoogleMapsMetaData[locationCoordinatesIndex]));
                    }
                }
                //Now we have all information tooltip metadata and coordinates - Send all this data to create a beautiful graphics on the map
                if(mapCoordinatesAndInfoHolderArray.length>0){
                    plotPinsOnMapWithGoogleMapsLocationsInformation();
                }

            }
            else{
                $("#no-result-error").animate({top:'0'});
            }
        },function(error){
            console.log("Error occurred in retrieving geo locaiton using Google's Geocoding APIs. Error description is : "+error);
        });;
    }
    else{
        console.log("no Locations info found for given input location name");
        return 0;
    }
}