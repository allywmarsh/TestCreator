//The URIs of the REST endpoint
IUPS = "https://prod-04.uksouth.logic.azure.com/workflows/fbc54c313b1440d6914366c0067ba1d0/triggers/manual/paths/invoke/rest/v1/videodata?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Pkst_R2CNnRRCvHxpEZbhBuhKkuXuAmZPrfrBC9yULg";
RAI = "https://prod-00.uksouth.logic.azure.com/workflows/6d86eaeba3314b1a8f0b8798b0ccd913/triggers/manual/paths/invoke/rest/v1/videodata?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Kgk2692jdA-M1n1fCEbDsU7mlXyUUL_lh6cxeRxIZ-g";

DIAURI0 = "https://prod-30.uksouth.logic.azure.com/workflows/75d3424c6c0a415093d116832832301c/triggers/manual/paths/invoke/rest/v1/videodata/";
DIAURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PMsv8weD35qhEUnN2GcZHpVxpO6g1I1ft5g10VYnzxM";

BLOB_ACCOUNT = "https://b00645579blob.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

window.onload = getClientPrincipal()

//A function to retrieve logged in user info
async function getClientPrincipal() {
  const response = await fetch('/.auth/me');
  const payload = await response.json();
  const { clientPrincipal } = payload;
  const user = clientPrincipal.userDetails;
  return user;  

}

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  getClientPrincipal().then((user) => {

  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('userName', user);
 submitData.append('Title', $('#Title').val());
 submitData.append('Publisher', $('#Publisher').val());
 submitData.append('Producer', $('#Producer').val());
 submitData.append('Genre', $('#Genre').val());
 submitData.append('ageRating', $('#ageRating').val());
 submitData.append('File', $("#UpFile")[0].files[0]);
 
 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: IUPS,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){
 getImages();
 }
 });
 
})};

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

  $.getJSON(RAI, function( data ) {

    //Create an array to hold all the retrieved assets
    var items = [];

    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each( data, function( key, val ) {

      items.push( "<hr />");
      items.push("<video width='500' height='400' controls>");
      items.push("<source src="+BLOB_ACCOUNT + val["filePath"] +" /> <br />");
      items.push("</video>");
      items.push( "<br>");
      items.push( "Video ID: " + val["videoID"] + "<br />");
      items.push( "Title: " + val["Title"] + "<br />");
      items.push( "Publisher: " + val["Publisher"] + "<br />");
      items.push( "Producer: " + val["Producer"] + "<br />");
      items.push( "Genre: " + val["Genre"] + "<br />");
      items.push( "Age Rating: " + val["ageRating"] + "<br />");
      items.push( "Uploaded By: " + val["userName"] + "<br />");
      items.push( "File Path: " + val["filePath"] + "<br />");
      items.push('<button type="button" id="subNewForm" class="btn btn-danger" onclick="deleteAsset('+val["videoID"] +')">Delete</button> <br/><br/>');

     });

      //Clear the assetlist div 
      $('#ImageList').empty();

      //Append the contents of the items array to the ImageList Div
      $( "<ul/>", {
       "class": "my-new-list",
       html: items.join( "" )
     }).appendTo( "#ImageList" );
   });
}

//A function to delete an asset with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteAsset(id){
  $.ajax({ 
    type: "DELETE",
    //Note the need to concatenate the 
    url: DIAURI0 + id + DIAURI1,
    }).done(function( msg ) {
    //On success, update the assetlist.
    getImages();
    });
    
}