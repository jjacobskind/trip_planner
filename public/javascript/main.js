var trip = {name:"Trip1", days: [{restaurants: [], activities: []}]};

var whichDay = 1;
var numDays = 1;    //!!!!! To be changed so that it gets set by length of days in object supplied by database!!!!!
var all_markers =[{}];
// var all_markers[whichDay-1] = all_markers[0];


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
  map = new google.maps.Map(map_canvas_obj, mapOptions);
  
  $("#map-canvas").append("map");
}
 
$(document).ready(function() {
  initialize_gmaps();
  populateList("complete");


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
    var valid = false;
    var type;
    if(id===undefined || whichDay<1 || whichDay>numDays) {  //handles when "Add" is clicked, but nothing is selected
      console.log("Invalid entry!");
    }
    else if(whichButton==="hotels_add") {
      if(!!current_day.hotel) {
        all_markers[whichDay-1][current_day.hotel].setMap(null);
        delete all_markers[whichDay-1][current_day.hotel];
      }
      current_day.hotel=id;
      populateList();
      valid=true;
      type="hotels";
    }
    else if(whichButton==="activities_add") {
      if(current_day.activities.indexOf(id)===-1) {
        current_day.activities.push(id);
        populateList();
        valid=true;
        type="activities";
      }
    }
    else if(whichButton==="restaurants_add") {
      if(current_day.restaurants.length<3) {
        current_day.restaurants.push(id);
        populateList();
        valid=true;
        type="restaurants";
      }
    }
    topButton.text($(this).parent().children("h2").text());
    var marker = new google.maps.Marker({
        position: getLocation(type, id),
        title: getProperty(type, id, "name")
    });
    if(!all_markers[whichDay-1].hasOwnProperty(id) || all_markers[whichDay-1][id].map===null) {
      all_markers[whichDay-1][id]=marker;
      marker.setMap(map);
    }
  });


  //Event handler for when "Add Day" button is clicked
  $("#add_day_group").on('click', 'button', function(event) {
    event.preventDefault();
    numDays++;
    trip.days.push({restaurants: [], activities: []});
    all_markers.push({});
    var dayBar = $("#add_day_group").parent().children().first();
    // if(numDays<5) {
      dayBar.append('<button type="button" class="btn btn-default day" data-id="'+ numDays + '">Day ' + numDays + '</button>');
    // }
    // else if (numDays===5) {
      //clear div and insert dropdown menu
    // } else {
      //add iitem to dropdown menu
    // }
  });

  $(".days_group").on('click', 'button', function() {
    event.preventDefault();
    for(var key in all_markers[whichDay-1]) {
      if(all_markers[whichDay-1].hasOwnProperty(key)) {
        all_markers[whichDay-1][key].setMap(null);
      }
    }
    whichDay = $(this).data("id");
    all_markers[whichDay-1] = all_markers[whichDay-1];
    for(var key in all_markers[whichDay-1]) {
      if(all_markers[whichDay-1].hasOwnProperty(key)) {
        all_markers[whichDay-1][key].setMap(map);
      }
    }
    $(this).parent().children().removeClass("btn-primary");
    $(this).addClass("btn-primary");
    populateList("complete");
 });

  //Event handler for when remove button is clicked
  $("#dynamic_fill").on('click', '.btn-remove', function(event) {
    event.preventDefault();

    var type = $(this).attr("data-type");
    var id = $(this).attr("data-id");
    var curDay = trip.days[whichDay-1];

    if(type==="hotel") {
      curDay.hotel = undefined;
    }
    else if(type==="activity") {
      var activities = trip.days[whichDay-1].activities;
      for(i=0, len=activities.length; i<len; i++) {
        if(id===activities[i]) {
          curDay.activities = activities.slice(0,i).concat(activities.slice(i+1));
        }
      }
    }
    else if(type==="restaurant") {
      var restaurants = trip.days[whichDay-1].restaurants;
      for(i=0, len=restaurants.length; i<len; i++) {
        if(id===restaurants[i]) {
          curDay.restaurants = restaurants.slice(0,i).concat(restaurants.slice(i+1));
        }
      }
    }
    populateList();
    var twice=false;
    if(type==="restaurant") {
      for(i=0,len=curDay.restaurants.length; i<len; i++) {
        if(id===curDay.restaurants[i]) {
          twice=true;
        }
      }
    }
    if(twice===false) {
      all_markers[whichDay-1][id].setMap(null);
      delete all_markers[whichDay-1][id];
    }
  });

}); 

var getProperty = function(category, id, key) {
  if(category==="hotels") {
    for(var i=0, len=all_hotels.length; i<len;i++) {
      if(all_hotels[i]._id===id) {
        return all_hotels[i][key];
      }
    }
  }
  else if(category==="activities") {
    for(var i=0, len=all_activities.length; i<len;i++) {
      if(all_activities[i]._id===id) {
        return all_activities[i][key];
      }
    }
  }
  else if(category==="restaurants") {
    for(var i=0, len=all_restaurants.length; i<len;i++) {
      if(all_restaurants[i]._id===id) {
        return all_restaurants[i][key];
      }
    }
  }
};

var populateList = function() {
  var current_day = trip.days[whichDay-1];
  var list = ["<h2>Plan for Day " + whichDay + "</h2><ul>"];
  var name = getProperty("hotels", current_day.hotel, "name");
  if(current_day.hotel!==undefined) {
    list.push("<li data-id='hotel'><h3>Hotel</h3><p>" + name 
      + " <a href='#' data-id='" + current_day.hotel + "' data-type='hotel' class='btn-remove'>Remove</a></p></li>");
  }
  var activities = current_day.activities;
  if(activities.length>0) {
    list.push("<li data-id='activities'><h3>Activities</h3>");
    for(i=0,len=activities.length; i<len;i++) {
      name = getProperty("activities", activities[i], "name");
      list.push("<p>" + name + 
        " <a href='#' data-id='" + activities[i] + "' data-type='activity' class='btn-remove'>Remove</a></p></li>");
    }
  }
  var restaurants = current_day.restaurants;
  if(restaurants.length>0) {
    list.push("<li data-id='restaurants'><h3>Restaurants</h3>");
    for(i=0,len=restaurants.length; i<len;i++) {
      name = getProperty("restaurants", restaurants[i], "name");
      list.push("<p>" + name + 
        " <a href='#' data-id='" + restaurants[i] + "' data-type='restaurant' class='btn-remove'>Remove</a></p></li>");
    }
  }
  list.push("</ul>");
  $("#dynamic_fill").html("");
  $("#dynamic_fill").append(list.join(""));
};


var getLocation = function(category, id) {
  if(category==="hotels") {
    for(var i=0, len=all_hotels.length; i<len;i++) {
      if(all_hotels[i]._id===id) {
        var coords = all_hotels[i]["place"][0]["location"];
      }
    }
  }
  else if(category==="activities") {
    for(i=0, len=all_activities.length; i<len;i++) {
      if(all_activities[i]._id===id) {
        coords = all_activities[i]["place"][0]["location"];
      }
    }
  }
  else if(category==="restaurants") {
    for(i=0, len=all_restaurants.length; i<len;i++) {
      if(all_restaurants[i]._id===id) {
        coords = all_restaurants[i]["place"][0]["location"];
      }
    }
  }
  return new google.maps.LatLng(coords[0], coords[1]);
};