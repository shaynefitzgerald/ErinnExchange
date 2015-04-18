var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
	id : Number,
	iconSrc :  { type : String, default : '/static/no_icon.png' },
	mwwLink : String,
	name : String,
	description : String,
});

exports.itemSchema = itemSchema;
exports.ItemModel = mongoose.model('ItemModel', itemSchema);