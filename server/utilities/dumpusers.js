var mongoose = require('mongoose');
var schema = require('../mongoSchema.js');
var fs = require('fs');

mongoose.connect('mongodb://application:buyerAfterSale@localhost/mabiMarket');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
schema.init(db);
UserModel = db.model('UserModel');
UserModel.find({}).exec(function(err, res){
	if(err){ return console.log(err) }
	fs.appendFileSync('users.txt', '{count : '+res.length+', data : [');
	for(var x = 0; x < res.length; x++){
		fs.appendFileSync('users.txt', JSON.stringify(res[x]) + ',\n');
	}
	fs.appendFileSync('users.txt', ']}'); 
});