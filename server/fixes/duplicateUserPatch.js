var mongoose = require('mongoose');
var schema = require('../mongoSchema.js')

mongoose.connect('mongodb://application:buyerAfterSale@localhost/mabiMarket');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

return schema.userModel.find({'user' : 'Maldaris'}).exec(function(err, res){
	if(err) { return console.log(err); }
	var containsValue = function(list, key, value){
		for(var x = 0; x < list.length; x++){
			if(list[x][key] === value){
				return true;
			}
		} return false;
	}
	var uniques = [];
	for(var x = 0; x < res[0].characters.length; x++){
		if(!containsValue(uniques, 'name', res[0].characters[x]['name'])){
			uniques.push(res[0].characters[x]);
		}
	}
	res[0].characters = uniques;
	return res[0].save(function(err){
		if(err) { return console.log(err);
		} else { 
			console.log("Patch OK") 
			return schema.userModel.find({'user' : 'Maldaris'}).exec(function(err, res){
				return console.log(res.toString());
			});
		}
	})
});