var rootSite = 'http://erinnexchange.com'

{ // templates -- this bracket pair is for my sanity.
	var listingCreateTemplateHTML = ["<h2 class='content-subhead center-div'>Create New Listing</h2>",
	"<div class=pure-g>",
	"	<div class=pure-u-1>",
	"		<form class='pure-form'>  ",
	"			<fieldset class='pure-group'> ",
	"				<input type='text' id=itemName class='pure-input-1' placeholder='Item Name'>  ",
	"				<input type='text' id=itemID class='pure-input-1' placeholder='Item ID'>  ",
	"			</fieldset>",
	"			<div id=disambEntry class=bordered-light></div>",
	"			 <fieldset class='pure-group'>  ",
	"				<input type='text' id=listingPrice class='pure-input-1' placeholder='Price'> ",
	"				<input type='text' id=listingMinBid class='pure-input-1' placeholder='Minimum Bid - Will default to 10&#37;'> ",
	"			</fieldset> ",
	"			<fieldset class='pure-group'> ",
	"				<input type='text' id=listingTags class='pure-input-1' placeholder='Tags (Comma Separated)'> ",
	"				<input type='text' id=listingNotes class='pure-input-1' placeholder='Additional Notes'> ",
	"			</fieldset> ",
	"			<fieldset class='pure-group'>",
	"				<label for='serverSelect'>Server: </label>",
	"				<select id=serverSelect> ",
	"					<option value=Alexina>Alexina</option> ",
	"					<option value=Mari>Mari</option> ",
	"					<option value=Ruairi>Ruairi</option> ",
	"					<option value=Tarlach>Tarlach</option> ",
	"				</select>",
	"				<label for='durationSelect'>Auction Duration:</label>",
	"				<select id=durationSelect> ",
	"					<option value=12>12 Hours</option> ",
	"					<option value=24>1 Day</option> ",
	"					<option value=48>2 Days</option> ",
	"					<option value=168>1 Week</option> ",
	"					<option value=336>2 Weeks</option> ",
	"				</select>",
	"			</fieldset> ",
	"			<label for='publicAfterClose'> ",
	"				<input type='checkbox' id='publicAfterClose' checked> Allow Listing to be used to generate Price Check Data",
	"			</label> </br>",
	"			<button id='listingCreateSubmit' class='pure-button pure-input-1 pure-button-primary'>Create Listing</button> ",
	"		</form>",
	"	<div id=createResult></div>",
	"	</div>",
	"%s",
	].join("\n");
	var loginTemplateHTML = ["<form class='pure-form'>",
	"    <fieldset>",
	"        <legend>Login</legend>",
	"",
	"        <input id=loginUsername type='text' placeholder='Username'>",
	"        <input id=loginPassword type='password' placeholder='Password'>",
	"",
	"        <label for='remember'>",
	"            <input id='remember' type='checkbox'> Remember me",
	"        </label>",
	"",
	"        <button type=submit id='submitLogin' class='pure-button pure-button-primary'>Login</button>",
	"    </fieldset>",
	"</form>",
	"%s",
	].join('\n');
	var listingSearchTemplateHTML = ["<div id=itemDBSearch>",
	"   <h2 class='content-subhead center-div'>Find a Listing</h2>",
	"   <form class='pure-form'>",
	"	<legend>Search Parameters</legend>",
	"		<fieldset><select id=typeSelect>",
	"			<option value=byItem>By Item Name/ID</option>",
	"			<option value=byOwner>By Owner</option>",
	"			<option value=byTags>By Tags</option>",
	"		</select>",
	"	<span id=optionContainer></span></fieldset>",
		"<fieldset>",
		"<label for='serverAlexina'> ",
		"<input id='serverAlexina' class=serverCheck type=checkbox></input> Alexina",
		"</label>",
		"<label for='serverMari'> ",
		"<input id='serverMari' class=serverCheck type=checkbox></input> Mari",
		"</label>",
		"<label for='serverRuairi'>",
		"<input id='serverRuairi' class=serverCheck type=checkbox></input> Ruairi",
		"</label>",
		"<label for='serverTarlach'>",
		"<input id='serverTarlach' class=serverCheck type=checkbox></input> Tarlach",
		"</label>",
		"</fieldset>",
		"<fieldset>",
		"<legend>Price Range (1 to 10m)</legend>",
		"<label for=priceMin>Minimum  <input type=range min=0 max=10000000 val=1 step=1000 id=priceSliderMin></input>",
		"<input type=text id=priceTextMin></input></label></fieldset>",
		"<fieldset><label for=priceMax>Maximum <input type=range min=1000 max=10000000 val=1000 step=1000 id=priceSliderMax></input>",
		"<input type=text id=priceTextMax></input></label>",
		"</fieldset>",		
	"	<button type='submit' id=listingSearchSubmit class='pure-button pure-button-primary'>Search</button>",
	"   </form>",
	"</div>",
	"<div class='pure-g searchEntryPoint'></div>",
	"%s",
	].join('\n');
	var itemDBTemplateHTML = "<div id=itemDBSearch><h2 class='content-subhead center-div'>Search the Item Database</h2><form class='pure-form'>\
		<fieldset><legend>Search Parameters</legend><input type='text' id='dbByID' placeholder='By ID'>\
		<input type='text' id='dbByName' placeholder='By Name'><label for='exactMatch'><input id='exactMatch' type='checkbox'> Exact Match</label>\
		<button type='submit' id=dbSearchSubmit class='pure-button pure-button-primary'>Search</button></fieldset></form></div>%s\
		<div class='pure-g searchEntryPoint'></div>";
	var homeTemplateHTML = "<div id=aboutUI><h2 class=\"content-subhead center-div\">About</h2>\
			<p id=AboutText> %s \
			</p><div class=sectional></div><h2 class=\"content-subhead center-div\">Latest Listings</h2>\
			<div class=\"pure-g listingEntryPoint\"> %s </div></div>";
	var aboutTemplateHTML = ["<div id=aboutUI>",
	"   <h2 class='content-subhead center-div'>About</h2>",
	"   <p id=AboutText> %s ",
	"   </p>",
	"   <h2 class='content-subhead center-div'>Changelog</h2>",
	"   <div class='changelogEntryPoint'> %s </div>",
	"</div>",
	"",].join('\n');
	var aboutTextTemplateHTML = ["Erinn Exchange is a full featured Market Site, boasting a robust searching and price checking system. </br>",
	"Listings are taggable, with descriptors such as Reforges, Enchants and Colors. </br>",
	"With a strong core backend, and a clean, simple UI, Erinn Exchange aims to be the fastest Market site for Mabinogi.</br>",
	"Feel free to browse the Item Database and the Market Listings on the left hand,</br>",
	"or login below to view your current listings.</br>",
	"Use the BugHerd tool in the bottom right to report bugs or errors if you encounter them, this vastly speeds up development!</i></br>",
	"Keep up to date with site news and updates at the devblog <a href='http://devblog.erinnexchange.com'>here</a>!",
	].join('\n');
	var changelogTemplateHTML = ["<div>",
	"<h3 class='content-subhead'>Known Bugs</h3><div id=BugEntry>%s</div>",
	"<h3 class='content-subhead'>Newest Features</h3><div id=NewFeaturesEntry>%s</div>",
	"<h3 class='content-subhead'>In Development</h3><div id=InDevEntry>%s</div>",
	"<h3 class='content-subhead'>Libraries and Tools used</h3><div id=LibEntry>%s</div>",
	"<h3 class='content-subhead'>Credits/Thanks</h3><div id=CreditsEntry>%s</div>",
	"</div>",
	].join('\n');
	var detailedListingTemplateHTML = ["<div class='pure-g detailedListing'>",
	"	<div class='pure-u-1-2 listingDataDetailed itemListingContainer itemListingPadding'>",
	"		<img src=%s></img>",
	"		",
	"		<div class='listingItemDescription'><div class='center-div'>Description</div>%s</div>",
	"		<div class='listingNotes'>Seller's Notes: %s</div>",
	"		<div class='detailedTagsContainer'>%s</div>",
	"		<div class='pure-g center-div'>",
	"			<div class='listingOwnerDetailed pure-u-1-3'>%s</div>",
	"			<div class='listingServerDetailed pure-u-1-3'>%s</div>",
	"		",
	"		<div class='listingPriceDetailed pure-u-1-3'>%s</div></div>",
	"	</div>",
	"	<div class='pure-u-1-3 bidDataDetailed' center-div><table class='pure-table pure-table-bordered'><thead><tr><th>Bid Amount</th><th>User</th></tr></thead><tbody>%s</tbody></table>",
	" <form class=pure-form> <fieldset><input type=text id=bidAmt placeholder='Bid Amount'></input>",
	" <button id='bidPlace' class='pure-button pure-button-primary'>Place Bid</button>",
	"</fieldset> </form><div class=pure-g id=bidError></div><div id=detailedDataHide class=DataHide>%s</div></div>",
	"</div>",
	].join('\n');
	var ListingTemplate = "\
	<div class='pure-u-%s itemListingContainer'>\
	<div class='itemListingPadding'>\
	<img src=\"%s\" onerror=\"handle404Image(this)\"></img>\
	<div class=listingItemName><a id=detailedView%s onclick='UIDetailedViewClickHandler($(this))'>\
	<img class=menusvg src='../static/dark37.svg'></a>%s</div>\
	<img class=goldIcon src='../static/gpicon.svg'><span class=goldPrice>%s</span> </img>\
	<div class=listingServer>%s</div>\
	<div class=listingOwnerContainer>%s</div>\
	<div class=listingTagsContainer>%s</div>\
	<div class=DataHide>%s</div>\
	</div></div>\
	";
	var accountTemplateHTML = ["<div id=accountContent class=pure-g>",
	"</div>%s",
	].join('\n');
	
	var accountBodyHTML = ["<div class='pure-u-1-2'><b>Username:</b> %s</div>",
	"	<div class=pure-u-1-2><b>Default Server:</b> %s</div>",
	"<div class=pure-u-1-2>",
	"	<div class=border-padding>",
	"		<table class='pure-table table-scroll'>",
	"			<thead>",
	"				<tr>",
	"				<td>Character Name</td><td>Server</td><td>Delete</td>",
	"				</tr>",
	"			</thead>",
	"			<tbody>",
	"				%s",
	"			</tbody>",
	"		</table>",
	"		<div id=removeCharacterResult></div>",
	"	</div>",
	"</div>",
	"<div class=pure-u-1-2>",
	"	<div class=border-padding>",
	"		<form class=pure-form>",
	"		<div><legend>Add additional characters</legend></div>",
	"		<input id=CharacterInput type=text class=pure-input-1 placeholder='Character Name'></input>",
	"		<select id=ServerSelect>",
	"			<option value='Alexina'>Alexina</option>",
	"			<option value='Mari'>Mari</option>",
	"			<option value='Ruairi'>Ruairi</option>",
	"			<option value='Tarlach'>Tarlach</option>",
	"		</select>",
	"		<button id=AddCharacterSubmit class='pure-button-primary pure-button' type=submit>Submit</button>",
	"		<div id=SubmitResult></div></form>",
	"	</div>",
	"</div>",
	"	<div class=pure-u-1-2></br>Open Listings</div><div class=pure-u-1-2></br>Closed Listings</div>",
	"	<div class=pure-u-1-2>",
	"		<table class='pure-table pure-table-bordered'>",
	"			<thead>",
	"				<tr><td>Listed Item</td><td>Server</td><td>View Listing</td><td>Close Listing</td></tr>",
	"			</thead>",
	"			<tbody>",
	"			%s",
	"			</tbody>",
	"		</table>",
	"	<div id=closeResult></div></div>",
	"	<div class=pure-u-1-2>",
	"		<table class='pure-table pure-table-bordered'>",
	"			<thead>",
	"				<tr><td>Listed Item</td><td>Server</td><td>View Listing</td></tr>",
	"			</thead>",
	"			<tbody>",
	"			%s",
	"			</tbody>",
	"		</table>",
	"	</div>",
	"	<div class=pure-u-1-2></br><legend>Bids (Active/Old Differentiation Coming Soon &#0153; )</legend></div><div class=pure-u-1-2></div>",
	"	<div class=pure-u-1-2>",
	"		<table class='pure-table pure-table-bordered'>",
	"			<thead>",
	"				<tr><td>Item</td><td>Server</td><td>Price</td></tr>",
	"			</thead>",
	"			<tbody>",
	"			%s",
	"			</tbody>",
	"		</table>",
	"	</div>",
	"	<div class=pure-u-1-2>",
	"	</div>",
	].join('\n');
	var openListingRowsTemplateHTML = ["<tr><td>%s</td><td>%s</td><td>",
	"<a class=AccountListingRef href=# data-listingid=%s data-server=%s data-open=%s onclick=\"UIAccountInspectListingHandler($(this).data('listingid'), $(this).data('server'), $(this).data('open'))\">View Listing</a></td>",
	"<td><a class=AccountCloseListing href=# data-listingid=%s onclick=\"UIAccountCloseListingHandler($(this).data('listingid'))\">Close</a></td></tr>"].join('\n');
	var standardErrorTemplateHTML = ["<div class=pure-u-1-3></div><div class=pure-u-1-3 id=ErrorElement></div><div class=pure-u-1-3></div"].join("\n");
	var accountCharRowsTemplateHTML = ["<tr><td>%s</td><td>%s</td><td class=center-link><a href=# data-name=%s onclick=\"UIAccountRemoveCharacterHandler($(this).data('name'));\">[x]</a></td></tr>"].join('\n');
	var closedListingRowsTemplateHTML = ["<tr><td>%s</td><td>%s</td><td>",
	"<a class=AccountListingRef href=# data-listingid=%s data-server=%s onclick=\"UIAccountInspectListingHandler($(this).data('listingid'), $(this).data('server'))\">View Listing</a></td></tr>",].join('\n');
	var registerTemplateHTML = ["<div class=pure-g>",
	"	<div class=pure-u-1>",
	"		<div class=content-subhead>Register</div>",
	"	</div>",
	"	<div class=pure-u-1>",
	"		<form id=registration class=pure-form>",
	"			<fieldset class=pure-group>",
	"			<input class=pure-input-1 type=text id=username placeholder='Username'></input>",
	"			<input class=pure-input-1 type=password id=password placeholder='Password'></input>",
	"			<input class=pure-input-1 type=password id=password2 placeholder='Reenter Password'></input>",
	"			<input class=pure-input-1 type=email id=email placeholder='Email'></input>",
	"			</fieldset>",
	"			<fieldset class=pure-group>",
	"			<input class=pure-input-1 type=text id=characterName placeholder='Main Character Name'></input>",
	"			<select id=serverSelect>",
	"				<option value=Alexina>Alexina</option> ",
	"				<option value=Mari>Mari</option> ",
	"				<option value=Ruairi>Ruairi</option> ",
	"				<option value=Tarlach>Tarlach</option> ",
	"			</select>",
	"			</fieldset>",
	"			<button type=submit id=submitRegister class='pure-button pure-button-primary'>Submit</button>",
	"		</form>",
	"		<div id=result></div>",
	"	</div>",
	"</div>%s",
	].join('\n');
	var accountBidsRowTemplateHTML = "<tr><td>%s</td><td>%s</td><td>%s</td></tr>";
	var disambiguationBodyTemplateHTML = ["<div>Name search turned up the following results. Please select a specific item by clicking the row.</div>",
		"<table class='pure-table pure-table-bordered'><thead><tr><td>Item ID</td><td>Item Name</td></thead><tbody>%s</tbody></table>",
		].join('\n');
	var disambiguationLineTemplateHTML = [
	"<tr data-id=\"%s\" data-name=\"%s\" onclick=\"UICreateListingDisambiguationHandler($(this))\"><td>%s</td><td>%s</td></tr>",
	].join('\n');
	var UIEditListingTemplateHTML = ["<div id='EditListing'>",
	"	<form class=pure-form>",
	"		<fieldset>",
	"			<legend>Select a listing to edit</legend>",
	"			<select id=listingSelect>",
	"			</select>",
	"		</fieldset>",
	"		<fieldset>",
	"			<div id=listingDataInsert></div>",
	"		</fieldset>",
	"		<fieldset class='pure-group'>",
	"			<input id=EditTags class=pure-input-1 placeholder='Tags, comma OR space separated'></input>",
	"			<input id=EditNotes class=pure-input-1 placeholder='Notes'></input>",
	"		</fieldset>",
	"		<button id=EditSubmit class='pure-button pure-button-primary' type=submit>Update Listing</button>",
	"		<div id=EditError></div>",
	"	</form>",
	"	%s",
	"</div>",].join('\n');
	var editListingSelectTemplateHTML = ["<option value=%s data-index=%s>%s | %s</option>"].join('\n');
}
var handle404Image = function(img){
	img.source = rootSite + "/static/no-image.png";
	img.onerror = "";
	return true;
}
var trim = function(str){
	return String(str).replace(/^\s+|\s+$/g, '');
};
var formatTags = function(tags){
	var TagsFormat = "<div class=listingTags onClick='UITagClickHandler($(this))'>%s</div>"
	var formattedTags = "";
	if(tags.length == 1){
		var stags = tags[0].split(' ').slice(0, 4);
		stags.forEach(function(a){
			if(!(a == "")){
				formattedTags += sprintf(TagsFormat, a);
			}
		});
	} else {
		tags.slice(0,4).forEach(function(a){
			formattedTags += sprintf(TagsFormat, a);
		});
	}
	return formattedTags;
}
var formatDetailedTags = function(tags){
	var TagsFormat = "<div class=listingTags onClick='UITagClickHandler($(this))'>%s</div>"
	var formattedTags = "";
	if(tags.length == 1){
		var stags = tags[0].split(' ');
		stags.forEach(function(a){
			if(!(a == "")){
				formattedTags += sprintf(TagsFormat, a);
			}
		});
	} else {
		tags.forEach(function(a){
			formattedTags += sprintf(TagsFormat, a);
		});
	}
	return formattedTags;
}
var resolveIconURL = function(url){
	var ret = "";
	if(url.indexOf('./')  > -1){ 
		ret = "http://mabinogi.x10.mx/itemdb/" + url.slice(2);
	}
	return ret == "" ? url : ret;
}
var validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
var parseTags = function(tags){
	return trim(tags).split(',');
}
var formatGold = function(value){
	return accounting.formatNumber(value);
}
var formatAccountCharacters = function(characters){
	var ret = "";
	for(var x = 0; x < characters.length; x++){
		ret += sprintf(accountCharRowsTemplateHTML, characters[x].name, characters[x].server, characters[x].name);
	}
	return ret;
}
var formatCompactError = function(err){
	var ErrorTemplate = ["",
	"<div class=pure-u-1>%s</div>",
	""].join('\n');
	return sprintf(ErrorTemplate.toString() , err.toString());
};
var formatAccountBids = function(bids){
	var ret = "";
	bids.forEach(function(a){

	});
	return ret;
};
var formatAccountOpenListings = function(listings){
	var ret = "";
	listings.forEach(function(a){
		//console.log(a);
		ret += sprintf(openListingRowsTemplateHTML, unescape(a.itemName), a.server, a.listingID, a.server, a.open, a.listingID);		
	});
	return ret;
};
var formatAccountClosedListings = function(listings){
	var ret = "";
	listings.forEach(function(a){
		//console.log(a);
		ret += sprintf(closedListingRowsTemplateHTML, unescape(a.itemName), a.server, a.listingID, a.server, a.open , a.listingID);		
	});
	return ret;
};
var formatListing = function(listing, elemPerLine){
	// console.log(listing);
	if(elemPerLine != null || elemPerLine != undefined){
		elemPerLine = "1-" + elemPerLine.toString();
	} else if(elemPerLine == 1){
		elemPerLine = "1";
	} else {
		elemPerLine = "1-5";
	}
	var formattedTags = formatTags(listing.tags);
	var resolvedURL = resolveIconURL(listing.itemData.iconSrc);
	var price = findHighestBid(listing.bids).amount > 0 ? findHighestBid(listing.bids).amount : listing.price;
	return sprintf(ListingTemplate.toString(), elemPerLine, resolvedURL , listing.listingID, unescape(listing.itemName), formatGold(price), listing.server,listing.listingOwner, formattedTags, JSON.stringify(listing));
};
var formatError = function(error){ 
	var ErrorTemplate = "\
	<div class=pure-u-1-3></div>\
	<div class=pure-u-1-3>%s</div>\
	<div class=pure-u-1-3></div>";
	return sprintf(ErrorTemplate.toString() , error.toString());
};
var formatItem = function(item, elemPerLine){
	var ItemTemplate = "\
	<div class='pure-u-%s' itemContainer>\
	<img class=center-div src=%s></img></br>\
	<span class=itemName>%s</span></br>\
	<span class=itemID><b>ID:</b>%s</span></br>\
	<span class=itemDescription>%s</span>\
	</div>\
	";
	var elemPerLine = "1-" + elemPerLine.toString();
	if(item.iconSrc.indexOf('./')  > -1){ 
		item.iconSrc = "http://mabinogi.x10.mx/itemdb/" + item.iconSrc.slice(2);
	}
	return sprintf(ItemTemplate.toString(),elemPerLine, item.iconSrc, unescape(item.name), item.id , unescape(item.description));
};
var formatChangelog = function(item){
	// console.log(item)
	var bugString = item[0]['KnownBugs'].join("</br>");
	var newFeatureString = item[0]['NewFeatures'].join('</br>');
	var libraryString = item[0]['LibrariesUsed'].join('</br>');
	var inDevString = item[0]['InDevFeatures'].join('</br>');
	var creditsString = item[0]['Credits'].join('</br>');
	return sprintf(changelogTemplateHTML, bugString, newFeatureString, inDevString, libraryString, creditsString);
}
var formatBidList = function(bids){
	var BidListTemplateHTML = "<tr><td>%s</td><td>%s</td></tr>";
	var formattedRows = "";
	bids.forEach(function(a){
		formattedRows += sprintf(BidListTemplateHTML, formatGold(a.amount), a.user);
	})
	return formattedRows;
}
var formatDetailedListing = function(dataHide){
	var highestBid = findHighestBid(dataHide.bids).amount > 0 ? findHighestBid(dataHide.bids).amount : dataHide.price;
	return sprintf(detailedListingTemplateHTML, resolveIconURL(dataHide.itemData.iconSrc), 
		unescape(dataHide.itemData.description), dataHide.listingNotes == "" ? "None": dataHide.listingNotes, formatDetailedTags(dataHide.tags), dataHide.listingOwner, dataHide.server,
		formatGold(highestBid), formatBidList(dataHide.bids), JSON.stringify(dataHide));
}
var formatAccountData = function(data){
	//console.log("DATA:" , data);
	var openListings = [];
	var closedListings = [];
	data[0].listings.forEach(function(a){
		//console.log("listings[",data[0].listings.indexOf(a),"]:" , a )
		if(a.open == false){
			closedListings.push(a);
		} else {
			openListings.push(a);
		}
		
	})
	// console.log(openListings, closedListings);
	return ret = sprintf(accountBodyHTML, data[0].user, data[0].characters[0].server, formatAccountCharacters(data[0].characters) ,formatAccountOpenListings(openListings), formatAccountClosedListings(closedListings), formatAccountBids(data[0].bids));
};
var formatDisambiguation = function(results){
	console.log(results);
	var lines = "";
	for(var x = 0; x < results.length; x++){
		lines += sprintf(disambiguationLineTemplateHTML, results[x].id, unescape(results[x].name), results[x].id, unescape(results[x].name));
	}
	return sprintf(disambiguationBodyTemplateHTML, lines);
};
var formatEditSelectOptions = function(listings){
	var ret = "";
	for(var x = 0; x < listings.length; x++){
		if(listings[x].open == false){
			continue;
		}
		var value = findHighestBid(listings[x].bids).amount != 0 ? findHighestBid(listings[x].bids).amount : listings[x].price
		ret += sprintf(editListingSelectTemplateHTML, listings[x].listingID, x, unescape(listings[x].itemName), formatGold(value));
	}
	return ret;
}

var findHighestBid = function(bids){
	var ret = { amount : 0 };
	bids.forEach(function(a){
		if(ret.amount < a.amount){
			ret = a;
		}
	})
	return ret;
}
var findObjectsWithValue = function(list, field, value){
	var ret = [];
	list.forEach(function(a){
		if(a[field] == value){
			ret.push(a);
		}
	});
	return ret;
}
var datamerger = function(listings, items){
	var ret = [];
	items.forEach(function(a){
		findObjectsWithValue(listings, 'itemID', a.itemID).forEach(function(b){
			var topush = {};
			$.extend(topush, a, b);
			ret.push(topush);
		});
	});
	return ret;
};
var compileHTML = function(elements, formatMethod, formatMethodArgs){
	// console.log(elements);
	if(Array.isArray(elements) && formatMethod != false){
		var html = "";
		for(var x = 0; x < elements.length; x++){
			// console.log(elements[x]);
			html += " " + formatMethod(elements[x], formatMethodArgs);
		}
		return (html);
	} else {
		return (formatMethod([elements], formatMethodArgs));
	}
};

var apiSubmitListing = function(data, callback){
	if(UIClientSessionContainer['lastListingSubmission'] != -1){
		if(Date.now() - UIClientSessionContainer['lastListingSubmission'].getTime() < 30000){
			return callback(compileHTML("You're submitting too many times. Please wait up to thirty seconds before attempting again.", formatCompactError));
		}
	}
	return callAJAX(rootSite + '/api/listNew', data, function(res, b, c){
		if(res.success == false){
			return callback(compileHTML(res.error.toString(), formatError));
		} else if(res.success == true){
			UIClientSessionContainer['lastListingSubmission'] = new Date(Date.now());
			return callback(compileHTML(res.result, formatError));
		} else {
			return callback(compileHTML(res.error, formatError));
		}
	});
};
var apiSearchListings = function(data, callback, format){
	return callAJAX(rootSite + '/api/searchListing' , data, function(res,b,c){
		// console.log(res);
		if(res.success == false){
			return callback(compileHTML(res.error.toString(), formatError));
		} else if(res.success == true && Array.isArray(res.result)){
			if(format != undefined) { 
				return callback(res);
			} else {
				return callback(compileHTML(res.result, formatListing, 5));
			}
		} else if(res.result == false){
			return callback(compileHTML("No Listings Found.", formatError));
		}
	})
};
var apiGetNewestListings = function(callback, raw){
	return callAJAX(rootSite + '/api/getNewestListings', { limit : 25 }, function(res, b, c){
		if(res.success === false){ callback(compileHTML(res.error.toString(), formatError)); }
		if(Array.isArray(res.result) && !(res.result == false)){
			if(raw){
				return callback(res);
			}
			return callback(compileHTML(res.result, formatListing))
		} else if(res.result === false) {
			return callback(compileHTML('No Listings found!', formatError));
		} else {
			return callback(compileHTML(JSON.stringify(res), formatError));
		}
	}, function(a,b,c){
		console.log(a , b, c);
	});
};
var apiSearchDatabase = function(pack, callback){
	callAJAX(rootSite + "/api/search", pack, function(res, b, c){
		if(res.success){
			if(Array.isArray(res.result)){
				return callback(compileHTML(res.result, formatItem, 5));
			} else {
				return callback(compileHTML("No Item found.", formatError));
			}
		} else {
			return callback(compileHTML(res.error.toString(), formatError));
		}
	}, function(error){
		return callback(compileHTML(error.toString(),formatError));
	});
};
var apiGetItemNameByID = function(id , callback){
	return callAJAX(rootSite + '/api/search', {'type': 0,'id' : id }, function(res, b, c){
		if(b) {
			console.log(b);
		}
		if(res.success == true){
			return callback(null, res.result[0].name);
		} else {
			return callback(res.error, false);
		}
	});
};
var apiGetItemIDByName = function(name , callback){
	return callAJAX(rootSite + '/api/search', {type : 1, 'name' : name }, function(res, b, c){
		if(res.success == false){
			return callback(res.error, false);
		} else if(res.result.length > 1) {
			return callback(formatDisambiguation(res.result), false);
		} else {
			return callback(null, res.result[0].name);
		}
	});
}
var apiLogin = function(data, callback){
	return callAJAX(rootSite + '/api/login', data, function(res, b,c){

		if(res.success == true){
			return callback(null, true);
		} else {
			return callback('Login Failed!', false);
		}
	});
}
var apiLogout = function(data, callback){
	return callAJAX(rootSite + '/api/logout', data, function(res, b,c){
		return callback(res);
	});
}
var apiIsLoggedIn = function(data, callback){
	callAJAX(rootSite + '/api/loggedIn', data, function(res, b,c){
		return callback(res);
	})
}
var apiGetChangelog = function(data, callback){
	return callAJAX(rootSite + '/api/changelog', data, function(res, b, c){
		// console.log(typeof res);
		if(res.success == false) { return calllback(compileHTML(res.error.toString(), formatError)) }
		return callback(compileHTML(res.result, formatChangelog));
	});
}
var apiPlaceBid = function(data, callback){
	if(UIClientSessionContainer['lastBidSubmission'] != -1){
		if(Date.now() - UIClientSessionContainer['lastBidSubmission'].getTime() < 30000){
			return callback({success : false, error:"You're repeating this action to quickly. Please wait up to 30 seconds."});
		}
	}
	return callAJAX(rootSite + '/api/bid', data, function(res, b, c){
		UIClientSessionContainer['lastBidSubmission'] = new Date(Date.now());
		return callback(res);
	});
};
var apiRegister = function(data, callback){
	return callAJAX(rootSite + '/api/register', data, function(res, b, c){
		if(res.success == true){
			return callback("Registered Successfully!");
		} else {
			return callback(compileHTML(res.error, formatCompactError));
		}
	});
}
var apiGetAccountData = function(data, callback, raw){
	return callAJAX(rootSite + '/api/account', data, function(res, b, c){
		console.log(typeof res, res);
		if(res.success == true){
			if(raw) { return callback(res.result) }
			try{
				return callback(compileHTML(res.result, formatAccountData));
			} catch (e){
				console.log(e);
				return callback(compileHTML(e.toString(), formatError));
			}
		} else {
			return callback(compileHTML(res.error, formatError));			
		}
	});
};
var apiAccountAddCharacter = function(data, callback){
	return callAJAX(rootSite + '/api/account/addCharacter', data, function(res, b, c){
		return callback(res);
	});
};
var apiAccountRemoveCharacter = function(data, callback){
	return callAJAX(rootSite + '/api/account/removeCharacter', data, function(res, b, c){
		return callback(res);
	});
};
var apiCloseListing = function(data, callback){
	return callAJAX(rootSite + '/api/account/closeListing', data, function(res, b, c){
		return callback(res);
	});
};
var apiEditListing = function(data, callback){
	return callAJAX(rootSite + '/api/account/editListing', data, function(res, b, c){
		if(res.success == true){
			return callback(null, res.result);
		} else {
			return callback(res.error, false);
		}
	});
};