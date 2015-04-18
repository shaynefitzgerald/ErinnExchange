var removeSpaces = function(a){
	return a.replace(/\s+/g, '');
};
var calculateTimeRemaining = function(){
	return "No idea"
};
var iconParser = function(a){
	if(a != undefined || a != "undefined"){
		if(a.indexOf("http://") < 0){
			return "<img class=tableIcon src=http://mabinogi.x10.mx/itemdb/" + a +"></img>";
		} else {
			return "<img class=tableIcon src="+ a +"></img>";
		}
	} else {
		return '<img class=tableIcon src="../static/no_icon.png"></img>';
	}
};
var wikiLinkParser = function(a){
	if(a === undefined || a === "undefined"){
		return 'No Link';
	} else {
		return '<a class=tableWikiLink href=' + a +'>Wiki Entry</a>';		
	}

};
var generateTableWithHeader = function(entry, id, headers, callback){
	entry.append("<table class=resultsTable id="+removeSpaces(id)+"></table>");
	var table = entry.find("#"+id);
	table.addClass()
	table.append('<tr></tr>');
	var headerRow = table.find('tr:first');
	for(var x = 0; x < headers.length; x++){
		headerRow.append('<th>'+headers[x]+'</th>');
	}
	return callback();
};
var insertRowToTable = function(id,headers,data){
	$('#'+id).append("<tr>");
	
	for(var x = 0;x < headers.length; x++){
		if(headers[x] == "Icon"){
			data[headers[x]] = iconParser(data[headers[x]]);
		} else if(headers[x] == "Wiki Link"){
			data[headers[x]] = wikiLinkParser(data[headers[x]]);
		}
		$("#"+removeSpaces(id)).find('tr:last').append("<td>"+unescape(data[headers[x]])+"</td>");
	}
	$("#"+id).append("</tr>");
	return;
};
var showNewestListings= function(){
	hideSplash();
	$('#dataEntryPoint').empty();
	callAJAX(rootSite + '/api/getNewestListings?', {limit : 50}, function(data){
		console.log(typeof data.result);
		console.log(data.result);
		if(data.error){
			$('#dataEntryPoint').append("<b> Failed to load newest listings with error: " + data.error.toString()+ '</b>');
			return;
		}
		if(data.result == false || data.result.length <= 0){
			$('#dataEntryPoint').append("<b> No listings found!</b>");
			return;
		}
		generateTableWithHeader($('#dataEntryPoint'), 'newestListings', Object.keys(data.result[0]), function(){
			data.result.forEach(function(a){
				insertRowToTable("newestListings", Object.keys(data.result[0]), a);
			});
		});
	}, function(err){
		$('#dataEntryPoint').append("<b> Failed on AJAX call with error: " + JSON.stringify(err) + '</b>');
		return;	
	});
}
var showListings = function(data, callback){
	console.log(data);
	$('#dataEntryPoint').empty();
	generateTableWithHeader($('#dataEntryPoint'), "listingSearchResults", data.headers, function(){
		if(Array.isArray(data.listings)){
			data.listings.forEach(function(a){ 
				insertRowToTable("listingSearchResults", data.headers, { 
					"Server" : a.server,
					"Item Name" : a.itemName,
					"Seller" : a.listingOwner,
					"Tags" : a.tags,
					"Listing Date" : a.timestamp,
					"Auction" : a.auction,
					"Minimum Bid" : a.midBid,
					"Time remaining" : calculateTimeRemaining(a.timestamp, a.timeout),
				});

			});
			return callback("listingSearchResults");
		} else {
			insertRowToTable("listingSearchResults", data.headers, { 
				"Server" : data.listings.server,
				"Item Name" : data.listings.itemName,
				"Seller" : data.listings.listingOwner,
				"Tags" : data.listings.tags,
				"Listing Date" : data.listings.timestamp,
				"Auction" : data.listings.auction,
				"Minimum Bid" : data.listings.midBid,
				"Time remaining" : calculateTimeRemaining(data.listings.timestamp, data.listings.timeout),
			});
			return callback("listingSearchResults");
		}
	});
};
var showItemEntries = function(data, callback){
	console.log(data);
	$('#dataEntryPoint').empty();
	generateTableWithHeader($('#dataEntryPoint'), "itemSearchResults", data.headers, function(){
		if(Array.isArray(data.itemEntry)){
			data.itemEntry.forEach(function(a){
				insertRowToTable("itemSearchResults", data.headers, { 
					'ID' : a.id,
					'Icon' : a.iconSrc,
					'Wiki Link' : (a.mmwLink === "undefined" || a.mmwLink === "undefined") ? "None" :  a.mmwLink,
					'Name' : a.name,
					'Description' : a.description,
				});

			});
			return callback('itemSearchResults');
		} else {
			insertRowToTable("itemSearchResults", data.headers, { 
				'ID' : data.itemEntry.id,
				'Icon' : data.itemEntry.iconSrc,
				'Wiki Link' : (data.itemEntry.mmwLink === "undefined" || data.itemEntry.mmwLink === "undefined") ? "None" :  data.itemEntry.mmwLink,
				'Name' : data.itemEntry.name,
				'Description' : data.itemEntry.description,
			});
			return callback("itemSearchResults");
		}
	});

};