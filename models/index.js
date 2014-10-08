var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/tripplanner");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));

var Place, Hotel, Activity, Restaurant;

var Schema = mongoose.Schema;

var placeSchema = new Schema({
	address: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	phone: String,
	location: [Number, Number]
});

var hotelSchema = new Schema ({
	name: {type: String, required: true},
	place: {type: [placeSchema], required:true},
	num_stars: {type: Number,
		required:true,
		min:1,
		max:5
	},
	amenities: String
});

var activitySchema = new Schema ({
	name: {type: String, required:true},
	place: [placeSchema],
	age_range: String
});

var restaurantSchema = new Schema ({
	name: {type: String, required:true},
	place: {type: [placeSchema], required:true},
	cuisine: String,
	price: {type: Number,
		required:true,
		min:1,
		max:5
	}
});

Place = mongoose.model('Place', placeSchema);
Hotel = mongoose.model('Hotel', hotelSchema);
Activity = mongoose.model('Activity', activitySchema);
Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
	"Place": Place,
	"Hotel": Hotel,
	"Activity": Activity,
	"Restaurant": Restaurant
};