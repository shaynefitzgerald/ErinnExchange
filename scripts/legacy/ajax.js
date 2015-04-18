var rootSite = String("http://erinnexchange.com");
function EncodeQueryData(data){
	var ret = [];
	for (var d in data){
		if(Array.isArray(d)){
			d.forEach(function(a){
				ret.push(encodeURIComponent(d)+ "=" + encodeURIComponent(a));
			});
		} else {
			ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
		}
	}
	return '?' + (ret.join("&"));
}
var callAJAX = function(url, params, scall, ecall){
	if(!scall){
		scall = function(data){
			return 'OK: ' + data;
		};
	}
	if(!ecall){
		ecall = function(jqhxr,a ,b ){
			console.log(a);
			console.log(b);
		};
	};
	return $.ajax({
		type : 'GET',
		url : url + EncodeQueryData(params),
		success : function(a,b,c){
			//console.log(a);
			console.log(b);
			//console.log(c);
			return scall(a,b,c)
		},
		error : ecall
	});
};