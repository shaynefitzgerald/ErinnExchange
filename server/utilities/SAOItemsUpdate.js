var siteBaseURL ="http://mabinogi.x10.mx/itemdb/?mode=search&search=gfSAOCollaboration&by=6&show=100&hide1=0&hide2=0%page="

var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

mongoose.connect('application:buyerAfterSale@localhost/mabiMarket');
var schema = require('../mongoSchema.js');
var db = mongoose.connection;
schema.init(db);
ItemModel = db.model('ItemModel');

var parseRow = function(row){
	row = cheerio.load(row);
	var itemID = row('td').eq(0).text();
	var mwwLink = row('td a.external-link').attr('href');
	var itemName = row('td a[style^="text-decoration"]').text();
	row('td[style^="max-width"] br').replaceWith('\n');
	var itemDesc = row('td[style^="max-width"]').text();
	//console.log(itemDesc);
	var iconSrc = row('td.icon img').attr('src');
	var ret = {
		'itemID' : itemID,
		'mwwLink' : mwwLink,
		'iconSrc' : iconSrc,
		'itemName' : itemName,
		'itemDesc' : itemDesc
	};
	return ret;
}
var getTable = function(page, callback){
	console.log("Loading Page: " + page);
	request(siteBaseURL+page.toString(), function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		$ = cheerio.load(body);
		var ret = [];
		for(var x = 1; x < $('table#results tr').length; x++){
			ret.push(parseRow($('table#results tr')[x]));
		}
		return callback(ret);
		} else {
		return callback(error);
	  }
	  }
	)
}
var commitItem = function(item){
	
}
var pageCount = process.argv[2];
var url = (process.argv.length > 3) ? process.argv[3] : siteBaseURL; 
fs.appendFileSync('./SAOItems.json', '[');
for(var x = 0; x < pageCount; x++){
	getTable(x, function(res){
		fs.appendFileSync('./SAOItems.json', JSON.stringify(res, undefined, 2) + ',\n');
	});
}

