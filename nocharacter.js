var mongoose = require('mongoose')
var fs = require('fs');
var mmSchema = require('./mongoSchema.js');

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.connect('mongodb://application:buyerAfterSale@localhost/mabiMarket');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var UserModel = mmSchema.userModel;

var json = [];

var getUserByName = function(obj, name){
	for(var x = 0; x< obj.length; x++){
		//console.log(obj[x].user + ' : ' + name);
		if(obj[x].user.toUpperCase() === name.toUpperCase()){
			//console.log(obj[x]);
			return obj[x];
		}
	} return -1;
};

UserModel.find({}, function(err, res){
	res.forEach(function(a){
		if(a.characters[0].name === undefined){
			console.log(a.user);
		} return;
	});
	return;
});