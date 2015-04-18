var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var math = require('mathjs')();

var fs = require('fs');
var path = require('path');

var ItemModel = require('./itemSchema.js').ItemModel;

mongoose.connect('mongodb://application:buyerAfterSale@localhost/mabiMarket');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var iterationsRequired = 292;
var runningDownloads = 0;
var maxDownloads = 250;
function download(url,filepath, overwrite, callback) {
		fs.exists(filepath, function(exists){
			if(!exists)
				request(url).pipe(fs.createWriteStream(filepath));
		});
}
var extractTableData = function(raw,callback){
	var ret = [];
	var table = raw.slice(raw.indexOf('<table id="results" class="tablesorter">'));
	table = table.slice(0, table.indexOf('</table>'));
	var $ = cheerio.load(table);
	$('tr').first().remove();
	var count = $('tr').length;
	$('tr').each(function(l, ei){
		var instr = 0;
		try {
			if($(this).find('td').first().children().length > 0){
				var id = $(this).find('td').first().text(); instr++;
			} else {
				var id = $(this).find('td').first().html(); instr++;
			//console.log(id);
			}
			var iconSrc = $(this).find('td.icon').find('img').attr('src'); instr++;
			var mwwLink = $(this).find('td.external-link').attr('href'); instr++;
			var name = escape($(this).find('td:nth-child(7)').children().first().text()); instr++;
			var description = escape($(this).find('td:nth-child(9)').children().first().text()); instr++;
			ret.push({'id' : id, 'iconSrc' : iconSrc, 'mmwLink' : mwwLink, 'name' : name, 'description' : description });
			if(count === ret.length){
				return callback(ret);
			}
		} catch(e){
			console.log(instr + ":" + e);
			return;
		}
	});
};
var saveHundredEntries = function(data){
	console.log('saving set: ' + data[0].id + ' to ' + data[data.length -1].id);
	try {
		data.forEach(function(a){
			if(a.name == ""){ return; }
			var toSave = new ItemModel({
				id : parseInt(a['id']),
				iconSrc : String(a['iconSrc']),
				mwwLink : String(a['mmwLink']),
				name : String(a['name']),
				description : String(a['description'])
			});
			return toSave.save(function(err,b){
				if(err){
					console.log('save failed on item: ' + a.name + ' \nwith error: ' + err);
				} else {
					console.log('save ok on: '+ a.name);
				}
			});
		});
	} catch (e){
		console.log('error on dbsave: ' + e);
	}
};
var getHundredEntries = function(offset){
	var url = "http://mabinogi.x10.mx/itemdb/?mode=search&search=&by=1&show=100&hide1=0&hide2=0&page="
	url += String(offset);
	//console.log(url);
	request(url, function(error, status, body){
		if(error) { console.log('req for db set ' + i + ' failed with error: '+ error); }
		console.log('got ' + offset + 'ok');
		extractTableData(body, function(result){
			return saveHundredEntries(result)
		});
	});
};

for(var x = 75; x < iterationsRequired; x++){
	getHundredEntries(x);
};

