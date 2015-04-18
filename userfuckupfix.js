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
UserModel.find({user : 'maldaris'}).exec(function(err, res){
	res[0].md5 = 'e5d8163183e98a4e9706fab787c50fb6';
	res[0].save(function(err){
		if(err) throw err;
	});
	return;
});
// fs.readFile('./userdump.txt', function(err, data){
	// if(err) throw err;
	// json = JSON.parse(data);
	// console.log(Array.isArray(json));
	//console.log(json);
	// rl.question('press any key to continue', function(answer){ 
		// UserModel.find({}).exec(function(err, res){
			// res.forEach(function(a){
				//console.log(a.user);
				// if(!a.characters[0].hasOwnProperty('name')){
					//console.log(json);
					// console.log('no character name for: ' + a.user);
					// var updated = getUserByName(json, a.user);
					// if(updated == -1){ return; }
					// a.characters[0].name = updated.characterName;
					// a.save(function(err){
						// if(err) throw err;
						// console.log(a.user + ' OK');
					// });
				// }
			// });
		// });
	// } );
// });