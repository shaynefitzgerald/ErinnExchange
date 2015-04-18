var objToQuery = function(a){
	var ret = ""
	Object.keys(a).forEach(function(b){
		if(Array.isArray(a[b])){
			a[b].forEach(function(c){
				ret+=b+"="+c+"&";
			});
		} else {
			ret+=b + "=" +a[b] +"&";
		}
	});
	return ret.slice(0, ret.length-1); // drop the last &
}

var query = new Object({
	listingID : "1",
	itemName : "Traveler's Guide",
	itemID : 0,
	tags : ['a', 'b'],
	price : 100,
	auction : true,
	server : "Alexina",
	publicAfterClose : false,
	minBid : 10,
});
console.log(objToQuery(query));