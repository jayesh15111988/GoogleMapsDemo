/**
 * Created by jayeshkawli on 9/17/14.
 */

//This is simple function to get promise for given URL and set of parameters
//We will simply use jQuery provided API to 'GET' data from specified endpoint

function getPromiseWithURLAndParameters(destinationURL,getParameters){
    return new Promise(function(resolve, reject) {

        $.ajax({
            url: destinationURL,
            type: 'GET',
            dataType: 'json',
            data : getParameters,
            success: function(successResponse) {
                resolve(successResponse);
            },
            error: function(errorResponse) {
                reject(errorResponse);
            }
        });


    });
}
