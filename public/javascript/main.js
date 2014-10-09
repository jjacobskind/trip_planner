var trip = {name:"Trip1", days: [{restaurants: [], activities: []}]};

var whichDay = 1;
var numDays = 1;    //!!!!! To be changed so that it gets set by length of days in object supplied by database!!!!!

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


  //Event handler for when dropdown item is clicked
  $(".dropdown-menu").on('click', 'a', function(event) {
    event.preventDefault();
    var top_field = $(this).closest("div").children().first();
    top_field.text($(this).text());
    var id = $(this).data("id");
    top_field.attr("data-id", id);

  });

  //Event handler for when "Add" (hotel/activity/restaurant) button is clicked
  $(".btn-primary").on("click", function() {
    event.preventDefault();
    var topButton = $(this).prev().children("button:first");
    var id = topButton.attr("data-id");
    var whichButton = $(this).attr("data-id");
    var current_day = trip.days[whichDay-1];
    if(id===undefined || whichDay<1 || whichDay>numDays) {  //handles when "Add" is clicked, but nothing is selected
      console.log("Invalid entry!");
    }
    else if(whichButton==="hotels_add") {
      current_day.hotel=id;
    }
    else if(whichButton==="activities_add") {
      if(current_day.activities.indexOf(id)===-1) {
        current_day.activities.push(id);
      }
    }
    else if(whichButton==="restaurants_add") {
      if(current_day.restaurants.length<3) {
        current_day.restaurants.push(id);
      }
    }
    topButton.text($(this).parent().children("h2").text());
  });


  //Event handler for when "Add Day" button is clicked
  $("#add_day_group").on('click', 'button', function(event) {
    event.preventDefault();
    numDays++;
    trip.days.push({restaurants: [], activities: []});
    var dayBar = $("#add_day_group").parent().children().first();
    if(numDays<5) {
      dayBar.append('<button type="button" class="btn btn-default day" data-id="'+ numDays + '">Day ' + numDays + '</button>');
    }
    else if (numDays===5) {
      //clear div and insert dropdown menu
    } else {
      //add iitem to dropdown menu
    }
  });

  $(".days_group").on('click', 'button', function() {
   event.preventDefault();
   whichDay = $(this).data("id");
   $(this).parent().children().removeClass("btn-primary");
   $(this).addClass("btn-primary");

  var current_day = trip.days[whichDay-1];
  var list = ["<h2>Plan for Day " + whichDay + "</h2><ul>"];
  if(current_day.hotel!==undefined) {
    list.push("<li><h3>Hotel</h3><p>" + getName("hotel", current_day.hotel) + "</p></li>");
  }
  $("#dynamic_fill").html("");
  $("#dynamic_fill").append(list.join(""));

 });

}); 

var getName = function(type, id) {
  if(type==="hotel") {
    for(var i=0, len=all_hotels.length; i<len;i++) {
      if(all_hotels[i]._id===id) {
        return all_hotels[i].name;
      }
    }
  }
  else if(type==="activity") {
    for(var i=0, len=all_activities.length; i<len;i++) {
      if(all_activities[i]._id===id) {
        return all_activities[i].name;
      }
    }
  }
  else if(type==="restaurant") {
    for(var i=0, len=all_restaurants.length; i<len;i++) {
      if(all_restaurants[i]._id===id) {
        return all_restaurants[i].name;
      }
    }
  }
};