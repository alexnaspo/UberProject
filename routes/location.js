var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/uber_test_database');

var Schema = mongoose.Schema; //Schema.ObjectId
 
var Location = new Schema({
    lat: { type: Number, required: true},
    lng: { type: Number, required: true},
    address: { 
        type: String, 
        required: true, 
    },
    name: { type: String, required: true, min: 0 }
});

var LocationModel = mongoose.model('Location', Location);

exports.list = function(req, res){
    LocationModel.find({}, function (err, locations) {
    	if(err){
    		return res.send(err);
    	} else {
    		return res.send(locations);	
    	}
        
    });
};

exports.create = function(req, res){
	var location;
	location = new LocationModel({
		name: req.body.name,
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,		
	});

	location.save(function (err) {
		if (!err) {
		  return console.log(location);
		} else {
		  return console.log(err);
		}	
	});
  return res.send(location);
}

exports.get = function(req, res){
	var id = req.params.id;
	return LocationModel.findById(id, function (err, location) {
		if (!err) {
		  return res.send(location);
		} else {
		  return res.send(err);
		}	
	});
};

exports.delete = function(req, res){
	var id = req.params.id;
	//@TODO change to findOneAndDelete
	LocationModel.findById(id, function (err, location) {
		if (!err) {
			location.remove(function (error, response){
				if(error){
					return res.send(err);
				} else {
					return res.send("success");
				}
			});

		} else {
		  return res.send(err);
		}	
	});

};

exports.update = function(req, res){
	var query = {_id: mongoose.Types.ObjectId(req.params.id)};
	var newLocation;
	newLocation = {
		name: req.body.name,
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,		
	};

	LocationModel.findOneAndUpdate(query, newLocation, function(err, response){
		if(err){
			res.send(err);
		} else {
			res.send(response);
		}
	});
};


