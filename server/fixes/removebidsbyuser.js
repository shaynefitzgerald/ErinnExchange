var mongoose = require('mongoose');
var schema = require('../mongoSchema.js')

mongoose.connect('mongodb://application:buyerAfterSale@localhost/mabiMarket');
var ee_db = mongoose.connection;
ee_db.on('error', console.error.bind(console, 'connection error:'));
schema.init(ee_db);
var ee_UserModel = ee_db.model('UserModel');
var ee_ListingModel = ee_db.model('ListingModel');
var ee_ItemModel = ee_db.model('ItemModel');
var ee_BidModel = ee_db.model('BidModel');


return ee_UserModel.findOne({'user' : 'poo'}).exec(function(err, res){
	if(err) { return console.log(err); }
	console.log(res);
	for(var x = 0; x < res.bids.length; x++){
		ee_ListingModel.find({'bids' : res.bids[x]}, function(err, res2){
			console.log(res2);
			if(err) { console.log(err); return; }
			for(var x1 = 0; x1 < res2.length; x1++){
				res2[x1].bids.splice(res2[x1].bids.indexOf(res.bids[x]),1);
				res2[x1].save(function(err){
					console.log(err);
				});
			}
		});
	}
	return
});