var util = require('util');
function isFunction(object) {
	return object && getClass.call(object) == '[object Function]';
}
var r20 = /%20/g,
function buildParams( prefix, obj, traditional, add ) {
	if ( util.isArray(obj) ) {
		a.forEach(function( v, i ) {
			if ( traditional || /\[\]$/.test( prefix ) ) {
				add( prefix, v );
			} else {
				buildParams( prefix + "[" + ( typeof v === "object" || util.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});	
	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		obj.forEach(function( v, k ) {
			buildParams( prefix + "[" + k + "]", v, traditional, add );
		});
	} else {
		add( prefix, obj );
	}
}
exports.param = function( a, traditional ) {
		var s = [], add = function( key, value ) {
			value = isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		};
		if ( util.isArray(a) ) {
			a.forEach(function(a) {
				add( a.name, a.value );
			});
		} else {
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix], traditional, add );
			}
		}
		return s.join("&").replace(r20, "+");
	}