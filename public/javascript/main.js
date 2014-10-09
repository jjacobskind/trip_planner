var trip = {name:"Trip1"};

function initialize_gmaps() {
 
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
 
  // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
 
  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById("map-canvas");
 
  // initialize a new Google Map with the options
  var map = new google.maps.Map(map_canvas_obj, mapOptions);
 
  // Add the marker to the map
  var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
  });
 
  // Add the marker to the map by calling setMap()
  marker.setMap(map);

  $("#map-canvas").append("map");
}


 
$(document).ready(function() {
  initialize_gmaps();

  var numDays = 3;

  //Dropdown item click handler
  $(".dropdown-menu").on('click', 'a', function(event) {
    event.preventDefault();
    var top_field = $(this).closest("div").children().first();
    top_field.text($(this).text());
    var id = $(this).data("id");
    top_field.attr("data-id", id);

  });

  // "Add" button click handler
  $(".btn-primary").on("click", function() {
    event.preventDefault();
    var text = $(this).prev().children("button:first").text()
  });

  // "Add Day" button click handler
  $("#add_day").on('click', 'button', function(event) {
    event.preventDefault();
    numDays++;
    var dayBar = $("#add_day").parent().children().first();
    if(numDays<5) {
      dayBar.append('<button type="button" class="btn btn-default">Day ' + numDays + '</button>');
    }
    else if (numDays===5) {
      //clear div and insert dropdown menu
    } else {
      //add iitem to dropdown menu
    }
  });

}); 