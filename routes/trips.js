var express = require('express');
var router = express.Router();
var model = require('../models');

router.post('/', function(req, res) {
	var attraction_id = req.body.attraction_id;
	var attraction_type = req.body.attraction_type;
	var trip_id = req.body.trip_id;
	var day_id = req.body.day_id -1;
	var action = req.body.action;
	model.Trip.findOne({"_id":trip_id}, function(err, obj) {
		if(obj===null) {
			obj = new model.Trip({
				"name":"Test Trip",
				"_id": trip_id,
				"days":[{
					"hotel":"",
					"activities":[],
					"restaurants":[]
				}]
			});
		}
		if(action==="add") {
			console.log("INSIDE ADD");
			if(attraction_type==="hotel") {
				obj.days[day_id][attraction_type]=attraction_id;
			} else if (attraction_type==="day") {
				obj.days.push({"hotel":"", "activities":[], "restaurants":[]});
			} 
			else {
				obj.days[day_id][attraction_type].push(attraction_id);
			}
		}
		else if(action==="remove") {
			if(attraction_type==="hotel") {
				obj.days[day_id][attraction_type]="";
			} else if (attraction_type==="day") {
				if(obj.days.length===1) {
					obj.days.pop();
				} else {
					obj.days.splice(day_id,1);
				}
			} else {
				var index = obj.days[day_id][attraction_type].indexOf(attraction_id);
				obj.days[day_id][attraction_type].splice(index, 1);
			}
		}
		obj.save();
		res.json(obj._id);
	});
});

// router.get('/:trip_id/:day_num', function(req, res) {
// 	var trip_id = req.params.trip_id;
// 	var day_num = req.params.day_num;
// 	day.populate("hotel activities restaurants")
// });

module.exports = router;