var trip = {id:"", name:"Trip1", days: [{restaurants: [], activities: []}]};

var whichDay = 1;
var numDays = 1;    //!!!!! To be changed so that it gets set by length of days in object supplied by database!!!!!
var all_markers =[{}];
// var day_markers = all_markers[0];
var day_markers = all_markers[whichDay-1];


var addMarker = function(id, type) {
    var location = getProperty(type, id, "location", true);
    var marker = new google.maps.Marker({
        position: location,
        title: getProperty(type, id, "name")
    });
    day_markers[id]=marker;
    // console.log(markerBounds);
    // markerBounds.extend(location);
    // var curMap = $("#map");
    // curMap.setCenter(markerBounds.getCenter(), curMap.getBoundsZoomLevel(markerBounds));
    marker.setMap(map);
    
};

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
  
  markerBounds = new google.maps.LatLngBounds();  //GLOBAL VARIABLE
  $("#map-canvas").append("map");
}
 
$(document).ready(function() {
  initialize_gmaps();
  populateList();

  $.get('/trips/543d5895809f5d6f53e2ae17/1', function(response) {
    console.log(response);
  });


  //Event handler for when dropdown item is clicked
  $(".dropdown-menu").on('click', 'a', function(event) {
    event.preventDefault();
    var top_field = $(this).closest("div").children().first();
    top_field.text($(this).text());
    var id = $(this).data("id");
    top_field.attr("data-id", id);

  });

  var updateTrip = function(type, attraction_id, action) {
    if(type==="hotels") {
      type="hotel";
    }
    var post_data = {
        "attraction_id": attraction_id,
        "attraction_type": type,
        "trip_id": "543d5895809f5d6f53e2ae17",
        "day_id": whichDay,
        "action": action
    };


    $.post('/trips', post_data, function(responseData) {
        trip.id = responseData;
    });
  };

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
        day_markers[current_day.hotel].setMap(null);
        delete day_markers[current_day.hotel];
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
    if(!day_markers.hasOwnProperty(id) || day_markers[id].map===null) {
      addMarker(id, type);
    }
    updateTrip(type, id, "add");
  });



  //Event handler for when "Add Day" button is clicked
  $("#add_day_group").on('click', 'button', function(event) {
    event.preventDefault();
    numDays++;
    trip.days.push({restaurants: [], activities: []});
    all_markers.push({});
    var dayBar = $("#add_day_group").parent().children().first();
    dayBar.append('<button type="button" class="btn btn-default day" data-id="'+ numDays + '">Day ' + numDays + '</button>');
    updateTrip("day", null, "add");
    $(".days_group").children(".btn-primary").removeClass("btn-primary");
    $(".days_group button:last-child").addClass("btn-primary");
    for(var key in day_markers) {
      if(day_markers.hasOwnProperty(key)) {
        day_markers[key].setMap(null);
      }
    }
    whichDay=numDays;
    day_markers = all_markers[whichDay-1];
    for(var key in day_markers) {
      if(day_markers.hasOwnProperty(key)) {
        day_markers[key].setMap(map);
      }
    }
    populateList();
  });

  //Event handler for when day is changed
  $(".days_group").on('click', 'button', function() {
    event.preventDefault();
    for(var key in day_markers) {
      if(day_markers.hasOwnProperty(key)) {
        day_markers[key].setMap(null);
      }
    }
    whichDay = $(this).data("id");
    day_markers = all_markers[whichDay-1];
    for(var key in day_markers) {
      if(day_markers.hasOwnProperty(key)) {
        day_markers[key].setMap(map);
      }
    }
    $(this).parent().children().removeClass("btn-primary");
    $(this).addClass("btn-primary");
    populateList();
 });

  //Event handler for when remove button is clicked
  $("#dynamic_fill").on('click', '.btn-remove', function(event) {
    event.preventDefault();

    var type = $(this).attr("data-type");
    var id = $(this).attr("data-id");
    var searchArr=[];
    var times_found = 0;
    switch(type) {
      case "hotel":
        trip.days[whichDay-1].hotel=undefined;
        var searchKey = "hotel";
        break;
      case "activity":
        searchArr = trip.days[whichDay-1].activities;
        var searchKey = "activities";
        break;
      case "restaurant":
        searchArr = trip.days[whichDay-1].restaurants;
        searchKey = "restaurants";
        break;
    }
    for(i=0, len=searchArr.length; i<len; i++) {
      if(id===searchArr[i]) {
        console.log(searchArr.length);
        trip.days[whichDay-1][searchKey] = searchArr.slice(0,i).concat(searchArr.slice(i+1));
        times_found++;
      }
    }
    updateTrip(searchKey, id, "remove");
    populateList();
    if(times_found<=1) {
      day_markers[id].setMap(null);
      delete day_markers[id];
    }
  });

  $("#dynamic_fill").on('click', '#removeDay', function(event) {
    event.preventDefault();
    var dayNum = $(this).attr("data-id") - 1;
    for(var key in all_markers[dayNum]) {
      if(all_markers[dayNum].hasOwnProperty(key)) {
        all_markers[dayNum][key].setMap(null);
      }
    }
    all_markers.splice(dayNum, 1);
    trip.days.splice(dayNum, 1);
    $(".days_group button:last-child").remove();
    numDays--;
    updateTrip("day", null, "remove");
    if(dayNum>=numDays) {
      whichDay = numDays;
      $(".days_group .btn-primary").removeClass("btn-primary");
      $(".days_group button:last-child").addClass("btn-primary");
    }
    populateList();
  });

}); 

var getProperty = function(category, id, key, on_place) {
  switch(category) {
    case "hotels":
      var searchArr = all_hotels;
      break;
    case "activities":
      searchArr = all_activities;
      break;
    case "restaurants":
      searchArr = all_restaurants;
      break;
  }
  if(!on_place) {
    for(var i=0, len=searchArr.length; i<len;i++) {
      if(searchArr[i]._id===id) {
        return searchArr[i][key];
      }
    }
  } else {
    console.log(searchArr, category);
    for(var i=0, len=searchArr.length; i<len;i++) {
      if(searchArr[i]._id===id) {
        var coords = searchArr[i]["place"][0][key];
        return new google.maps.LatLng(coords[0], coords[1]);
      }
    }
  }

};

//Draw day itinerary
var populateList = function() {
  $("#dynamic_fill").html("");
  var current_day = trip.days[whichDay-1];
  var list = ["<p><h2>Plan for Day " + whichDay + "</h2><a href='#' data-id='" + whichDay + "' id='removeDay'>Remove Day</a></p><ul>"];
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
        " <a href='#' data-id='" + activities[i] + "' data-type='activity' class='btn-remove'>Remove</a></p>");
    }
    list.push("</li>");
  }
  var restaurants = current_day.restaurants;
  if(restaurants.length>0) {
    list.push("<li data-id='restaurants'><h3>Restaurants</h3>");
    for(i=0,len=restaurants.length; i<len;i++) {
      name = getProperty("restaurants", restaurants[i], "name");
      list.push("<p>" + name + 
        " <a href='#' data-id='" + restaurants[i] + "' data-type='restaurant' class='btn-remove'>Remove</a></p>");
    }
    list.push("</li>");
  }
  list.push("</ul>");
  $("#dynamic_fill").append(list.join(""));
};