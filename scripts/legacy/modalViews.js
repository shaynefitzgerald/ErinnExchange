var loginHtml = "<div class=svert>\
	</br><b> Login </b></br>\
	<form id='loginForm'>\
		Name: <input id='loginUsername' type=text></input></br>\
		Password: <input id='loginPassword' type=password></input></br>\
		<button type=button id='modalSubmit' value='Login'>Login</button>\
	</form>\
	</div>\
	<div id=AJAXResponse> </div>\
";
var loginSuccessHtml = "<div class=svert></br>\
	<b> Login Success!</b></br>\
	Logged in as:  <div id=loginSuccessUser></div>\
</div>\
";
var loginFailedHtml = "<div class=svert></br>\
	<b> Login Failed!</b></br>\
	</div>\
";
var logoutSuccessHtml = '<div class=svert></br>\
	<b>Logged Out!</b></br>\
</div>\
';
var badSearch = "<b>Failed to Search!<b>\
</br><div id=searchErrorMsg></div>\
";
var listingError = "</br><b>Failed to Create Listing!</b></br>\
One or more of the following errors have occured:<br>\
<div id=listingErrorEntry></div>\
"
var initialSearchHtml = "</br><b>Find an item to list</b>\
</br> If you know the ID, you can use it to immediately create the listing.\
</br> Otherwise, Enter the item's name in the search bar.\
</br> <input type=text id=SearchBar></input>   <input id=searchCheckbox value='1' type=checkbox>Exact Match</input>\
</br> <input type=button id=modalSubmit1 value='Search Name'></input>\
<input type=button id=modalSubmit2 value='Search ID'></input></br>\
<div id=searchError></div>\
";
var createListingWItemEntry = "<b>Create Listing</b>\
</br> Item Name: <span id=ItemName>%1</span> (<span id=ItemID>%2</span>)\
</br> Tags: <input type=text id=tags></input>\
</br> Price: <input type=text id=price></input>\
</br> Create As Auction: <input type=Checkbox id=isAuction></input>\
</br> Minimum Bid Increase: <input type=text id=minBid></input>\
</br> <input type=button id=modalSubmit value=Submit></input>\
";
var registerHtml = "</br><b>Register</b></br>\
	<form id=registration action>\
		Username: <input type=text id=registerUsername></input></br>\
		Password: <input type=password id=registerPassword1></input></br>\
		Reenter Password: <input type=password id=registerPassword2></input></br>\
		Email : <input type=text id=registerEmail></input></br>\
		Character: <input type=text id=registerCharName></input></br>\
		Server: <select id=registerSelectServer>\
			<option value=Alexina>Alexina</option>\
			<option value=Mari>Mari</option>\
			<option value=Ruairi>Ruairi</option>\
			<option value=Tarlach>Tarlach</option>\
		</select></br>\
		<input type=button id='modalSubmit' value='Submit'></input>\
	</form>\
	<div id='registerResult'></div>\
";
var registerSuccessHtml = "</br><b> Successfully registered!</b>"
var logoutHtml = "\
	<div class=svert logout>\
	</br><b> Logout?</b></br>\
	<button type=button id='modalSubmit' value='OK'>OK</button>\
	</div>\
	<div id=AJAXResponse> </div>\
";