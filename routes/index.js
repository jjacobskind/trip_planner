var express = require('express');
var models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	models.Hotel.find(function(err, hotel_results) {
		models.Restaurant.find(function(err, restaurant_results) {
			models.Activity.find(function(err, activity_results) {
			  res.render('index', { title: 'Trip Planner', 
			  						hotels: hotel_results,
			  						restaurants: restaurant_results, 
			  						activities: activity_results
			  						 });
			});
		});

	});
});

module.exports = router;
