var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Schema.ObjectId

mongoose.connect('mongodb://localhost/uber_test_database');
 
var LocationSchema = new Schema({
    lat: { type: Number, required: true},
    lng: { type: Number, required: true},
    address: { 
        type: String, 
        required: true, 
    },
    title: { type: String, required: true, min: 0 }
});

var locationModel = mongoose.model('Location', LocationSchema);

module.exports = {
	LocationModel: locationModel
}
