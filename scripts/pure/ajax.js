
var rootSite = String("http://erinnexchange.com");

var callAJAX = function(url, params, scall, ecall){
	console.log($.param(params));
	if(!scall){
		scall = function(data){
			return 'OK: ' + data;
		};
	}
	if(!ecall){
		ecall = function(jqhxr,a ,b ){
			console.log(a);
			console.log(b);
			console.log(jqhxr);
		};
	};
	return $.ajax({
		type : 'GET',
		url : url + "?" + $.param(params),
		success : function(a,b,c){
			//console.log(a);
			//console.log(b);
			//console.log(c);
			return scall(a,b,c)
		},
		error : ecall
	});
};