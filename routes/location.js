var mongoose = require('mongoose');
var LocationModel = require('../models/location').LocationModel;

exports.list = function(req, res){
    LocationModel.find({}, function (err, locations) {
    	if(err){
    		return res.send(new Error('failed to get all locations', err));
    	} else {
    		return res.send(locations);	
    	}
        
    });
};

exports.create = function(req, res){
	var location;
	location = new LocationModel({
		title: req.body.title,
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,		
	});

	location.save(function (err) {
		if (err) {
			return res.send(new Error('failed to create location', err));
		} else {
		 	return res.send(location);
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
		  return res.send(new Error('failed to get location', err));
		}	
	});
};

exports.delete = function(req, res){
	var query = {_id: mongoose.Types.ObjectId(req.params.id)};
	LocationModel.remove(query, function(err, response){
		if(err){
			res.send(new Error('failed to delete location', err));
		} else {
			res.send(response);
		}
	});

};

exports.update = function(req, res){
	var query = {_id: mongoose.Types.ObjectId(req.params.id)};
	var newLocation;
	newLocation = {
		title: req.body.title,
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,		
	};

	LocationModel.findOneAndUpdate(query, newLocation, function(err, response){
		if(err){
			res.send(new Error('failed to update location', err));
		} else {
			res.send(response);
		}
	});
};
