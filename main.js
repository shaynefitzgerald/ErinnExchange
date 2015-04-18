{ //Imports
	var debug = false;
	var connect = require( 'connect-json' );
	var urlparser = require( 'url' );
	var sessions = require( 'client-sessions' );
	var http = require( 'http' );
	var express = require( 'express' );
	var url = require( 'url' );
	var mongoose = require( 'mongoose' );
	var mmSchema = require( ( debug ) ? "./mongoSchema.js" : "./server/mongoSchema.js" );
	var querystring = require( 'querystring' );
	var crypto = require( 'crypto' );
	var async = require( 'async' );
	var fs = require( 'fs' );
	var util = require( 'util' );
	var sprintf = require( 'sprintf' ).sprintf;
	var vhost = require( 'vhost' );
} { //Database connections
	var ee_db = mongoose.createConnection( 'mongodb://application:buyerAfterSale@localhost/mabiMarket' );
	//var ac_db = mongoose.createConnection('mongodb://application:buyerAfterSale@localhost/accounting');
	ee_db.on( 'error', console.error.bind( console, 'connection error:' ) );
	//ac_db.on('error', console.error.bind(console, 'connection error:'));
} { //Common Functions
	var containsKeys = function ( a, b ) {
		var ret = true;
		for ( var x = 0; x < b.length; x++ ) {
			if ( !( a.hasOwnProperty( b[ x ] ) ) ) {
				ret = false;
			}
		}
		return ret;
	};
	var containsAtLeastOne = function ( a, b ) {
		var ret = false;
		for ( var x = 0; x < b.length; x++ ) {
			if ( ( a.hasOwnProperty( b[ x ] ) ) ) {
				ret = true;
			}
		}
		return ret;
	};
}

{ //Accounting Data layer functions

} { //Accounting Routes / Express Application
	var um_app = express();
	um_app.get( '/', function ( req, res ) {
		res.sendfile( 'index.html', {
				root: __dirname + '/public'
			} )
			// res.end('Coming Soon...');
	} );

	um_app.use( '/static', express.static( __dirname + '/static' ) );
}

{ //Erinn Exchange Data Layer functions
	mmSchema.init( ee_db );
	var ee_UserModel = ee_db.model( 'UserModel' );
	var ee_ListingModel = ee_db.model( 'ListingModel' );
	var ee_ItemModel = ee_db.model( 'ItemModel' );
	var ee_BidModel = ee_db.model( 'BidModel' );

	var ee_getNewestListings = function ( dat, callback ) {
		try {
			ee_ListingModel.find( {
				'open': true
			} ).sort( {
				'timestamp': -1
			} ).limit( dat[ 'limit' ] ).populate( 'itemData' ).populate( 'bids' ).exec( function ( err, res ) {
				if ( err ) {
					return callback( err.toString(), false )
				}
				if ( res.length == 0 ) {
					return callback( null, false );
				}
				// res.forEach(function(a){
				// console.log(a.itemData);
				// })
				return callback( null, res );
			} );
		} catch ( e ) {
			callback( e.toString(), false );
		}
	};
	var ee_getItemByID = function ( id, callback ) {
		ee_ItemModel.find( {
			'id': id
		} ).limit( 100 ).exec( function ( err, res ) {
			if ( err ) {
				return callback( err, false );
			}
			if ( res === undefined ) {
				return callback( 'No items by that ID', false );
			}
			return callback( null, res )
		} );
	};
	var ee_getItemByName = function ( name, callback ) {
		ee_ItemModel.find( {
			'name': name
		} ).limit( 100 ).exec( function ( err, res ) {
			if ( err ) {
				return callback( err, false );
			}
			if ( res.length <= 0 ) {
				callback( null, false );
			}
			if ( Array.isArray( res ) ) {
				return callback( null, {} );
			} else {
				return callback( null, res[ 0 ] );
			}
		} );
	};
	var ee_getItemByNameRegex = function ( name, callback ) {
		try {
			ee_ItemModel.find( {
				'name': {
					$regex: new RegExp( name, 'i' )
				}
			} ).limit( 100 ).exec( function ( err, res ) {
				if ( err ) {
					return callback( err.toString(), false );
				}
				if ( res.length <= 0 ) {
					return callback( null, false );
				}
				return callback( null, res );
			} );
		} catch ( e ) {
			callback( e.toString(), false );
		}
	};
	var ee_userValidate = function ( user, hash, callback ) {
		ee_UserModel.find( {
			'user': user
		} ).limit( 1 ).exec( function ( error, results ) {
			if ( results === [] || results.length <= 0 ) {
				callback( false );
			} else {
				if ( hash === results[ 0 ].md5 ) {
					callback( true );
				} else {
					callback( false );
				}
			}
		} );
	};
	var ee_userRegister = function ( dat, callback ) {
		ee_UserModel.findOne( {
			'email': dat[ 'email' ]
		} ).exec( function ( err, res ) {
			if ( res === null ) {
				ee_UserModel.findOne( {
					'user': dat[ 'user' ]
				} ).exec( function ( err, res ) {
					if ( res === null ) {
						var toAdd = new ee_UserModel( {
							user: dat[ 'user' ],
							md5: dat[ 'md5' ],
							email: dat[ 'email' ],
							characters: [ {
								name: dat[ 'characterName' ],
								server: dat[ 'server' ]
							} ]
						} );
						toAdd.save( function ( err ) {
							if ( err ) callback( err, false );
							callback( null, true );
						} );
					} else {
						callback( 'User is taken!', false );
					}
				} );
			} else {
				callback( 'Email is already registered!', false );
			}
		} );
	};
	var ee_getUsersDefaultServer = function ( user, callback ) {
		ee_UserModel.findOne( {
			'user': user
		}, function ( err, res ) {
			if ( err ) callback( err );
			callback( null, res.characters[ 0 ][ 'server' ] );
		} );
	};
	var ee_itemListingIsValid = function ( dat, callback ) {
		ee_ItemModel.find( {
			id: dat.id,
			name: dat.name
		} ).exec( function ( err, res ) {
			if ( err ) {
				return callback( "error on item validation. Contact site admin with the following: \n" + err, false, null );
			}
			if ( res.length <= 0 ) {
				return callback( null, false, null );
			} else {
				console.log( res );
				return callback( null, true, res[ 0 ]._id );
			}
		} );
	};
	var ee_listingAddNew = function ( dat, callback ) {
		// console.log('inside ee_listingAddNew');
		// console.log(dat);
		return ee_ListingModel.find().sort( {
			listingID: -1
		} ).limit( 1 ).exec( function ( err, res ) {
			// console.log('listingID search complete');
			// console.log(res);
			if ( Array.isArray( res ) && res.length == 0 ) {
				dat[ 'listingID' ] = 0; //This wonderful piece will be run once ;n;
			} else {
				//console.log('new listing with ID: ' + Number(res[0].listingID) + 1);
				dat[ 'listingID' ] = Number( res[ 0 ].listingID ) + 1;
			}
			ee_itemListingIsValid( {
				name: dat[ 'itemName' ],
				id: dat[ 'itemID' ],
			}, function ( err, ok, item ) {
				if ( err ) {
					return callback( err, false );
				}
				if ( ok === true ) {
					var toAdd = new ee_ListingModel( {
						listingID: dat[ 'listingID' ],
						itemName: dat[ 'itemName' ],
						listingOwner: dat[ 'user' ],
						itemID: dat[ 'itemID' ],
						tags: dat[ 'tags[]' ],
						price: dat[ 'price' ],
						timestamp: Date.now(),
						auction: dat[ 'auction' ],
						server: dat[ 'server' ],
						publicAfterClose: dat[ 'publicAfterClose' ],
						minBid: dat[ 'minBid' ],
						curBid: dat[ 'price' ],
						open: true,
						listingNotes: dat[ 'listingNotes' ],
						timeout: Date.now() + ( dat[ 'timeout' ] * 3600000 ),
						itemData: item,
					} );
					return toAdd.save( function ( err ) {
						if ( err ) return callback( err, false );
						return ee_UserModel.find( {
							'user': dat[ 'user' ]
						} ).limit( 1 ).exec( function ( err, res ) {
							if ( err ) return callback( err, false );
							console.log( toAdd._id );
							res[ 0 ].listings.push( toAdd._id );
							return res[ 0 ].save( function ( err ) {
								if ( err ) {
									return callback( err, false );
								}
								return callback( null, true );
							} )

						} );
					} );
				} else {
					return callback( 'err: Item Name/ID could not be matched to item DB entry!', false );
				}
			} );
		} );
	};
	var ee_getHighestBid = function ( listing ) {
		if ( listing.bids.length <= 0 ) {
			return {
				user: 'none',
				amount: listing.price
			};
		}
		var ret = listing.bids[ 0 ];
		listing.bids.forEach( function ( a ) {
			if ( a.amount > ret.amount ) {
				ret = a;
			}
		} );
		return ret;
	};
	var ee_checkBidBounds = function ( listing, curBid, bid ) {
		if ( listing.price >= bid ) {
			//console.log('less than price');
			return false;
		} else if ( curBid.amount >= bid ) {
			//console.log('less than curBid');
			return false;
		} else if ( Number( curBid.amount ) + Number( listing.minBid ) > bid ) {
			//console.log('less than curBid + minBid');
			return false;
		} else {
			//console.log('bid OK');
			return true;
		}
	};
	var ee_makeBid = function ( data, callback ) {
		return ee_ListingModel.find( {
			listingID: data[ 'listingID' ]
		} ).limit( 1 ).populate( 'bids' ).exec( function ( err, result ) {
			if ( err ) callback( err, false );
			if ( result.length === 0 ) {
				return callback( 'no such listing', false );
			} else {
				var highestBid = ee_getHighestBid( result[ 0 ] ) == undefined ? 0 : ee_getHighestBid( result[ 0 ] );
				console.log( highestBid.amount );
				console.log( highestBid.amount < Number( data[ 'bid' ] ) );
				if ( ee_checkBidBounds( result[ 0 ], highestBid, data[ 'bid' ] ) === false ) {
					return callback( 'bid too low', false );
				} else {
					var newBid = new ee_BidModel( {
						user: data[ 'user' ],
						amount: data[ 'bid' ],
						listingID: result[ 0 ].listingID,
						listingRef: result[ 0 ]._id,
					} );
					return newBid.save( function ( err ) {
						if ( err ) return callback( err, false );
						result[ 0 ].bids.push( newBid._id );
						return result[ 0 ].save( function ( err ) {
							if ( err ) return callback( err, false );
							return ee_UserModel.find( {
								'user': data[ 'user' ]
							} ).limit( 1 ).exec( function ( err, res ) {
								if ( err ) return callback( err, false );
								res[ 0 ].bids.push( newBid._id );
								return res[ 0 ].save( function ( err ) {
									if ( err ) return callback( err, false );
									return callback( null, true );
								} );
							} )
						} );
					} );
				}
			}
		} );
	};
	var ee_findListing = function ( type, data, callback ) {
		try {
			var opt = {};
			if ( [ 'pricegt', 'pricelt', 'priceeq' ].indexOf( type ) >= 0 ) {
				regexPriceFormatter( type, data, opt );
			} else if ( type === 'tags' ) {
				if ( util.isArray( data[ 'tags[]' ] ) && data[ 'tags[]' ].length > 1 ) {
					opt[ type ] = {
						'$all': data[ 'tags[]' ]
					};
				} else {
					opt[ type ] = data[ 'tags[]' ];
				}
			} else if ( type === 'itemName' ) {
				if ( data[ 'exact' ] == true ) {
					opt[ type ] = escape( data[ type ] );
				} else {
					opt[ type ] = {
						$regex: new RegExp( escape( data[ type ] ), 'i' )
					};
				}
			} else if ( type === 'empty' ) {
				//do nothing, dumb, but better than catching every possible combination.
			} else {
				opt[ type ] = data[ type ];
			}
			opt[ 'price' ] = {
				'$gt': Number( data[ 'priceMin' ] ),
				'$lt': Number( data[ 'priceMax' ] )
			};
			opt[ 'server' ] = util.isArray( data[ 'server[]' ] ) ? {
				'$in': data[ 'server[]' ]
			} : data[ 'server[]' ];
			opt[ 'auction' ] = data[ 'auction' ];
			opt[ 'open' ] = data[ 'open' ] != undefined ? data[ 'open' ] : true;
			//console.log(opt);
			ee_ListingModel.find( opt ).populate( 'itemData' ).populate( 'bids' ).exec( function ( err, result ) {
				if ( err ) {
					return callback( err, false )
				}
				if ( result.length <= 0 ) {
					return callback( null, false )
				}
				return callback( null, result );
			} );
		} catch ( e ) {
			return callback( e.toString(), false );
		}
	};
	var ee_complexListingSearch = function ( data, categories, callback ) {
		var toIterate = [];
		categories.forEach( function ( a ) {
			toIterate.push( [ a, data[ a ] ] );
		} );
		async.map( toIterate, function ( item, cb ) {
			ee_findListing( item[ 0 ], item[ 1 ], function ( err, res ) {
				if ( err ) {
					return cb( err, false );
				}
				if ( res ) {
					return cb( null, res );
				}
				return cb( null, null );
			} );
		}, function ( err ) {
			return callback( err, false )
		}, function ( err, results ) {
			return callback( null, results );
		} );
	};
	var ee_simpleListingSearch = function ( data, category, callback ) {
		ee_findListing( category, data, function ( err, result ) {
			if ( err ) {
				return callback( err, false )
			}
			if ( !result ) {
				return callback( null, false );
			} else {
				return callback( null, result );
			}
		} );
	};
	var ee_getAccountData = function ( user, callback ) {
		return ee_UserModel.find( {
			'user': user
		} ).populate( 'bids listings' ).limit( 1 ).exec( function ( err, res ) {
			if ( err ) return callback( err, false );
			return callback( null, res[ 0 ] );
		} );
	};
	var ee_characterAlreadyExists = function ( a, b ) {
		var names = [];
		for ( var x = 0; x < a.length; x++ ) {
			names.push( a[ x ].name );
		}
		if ( names.indexOf( b ) > -1 ) {
			return true;
		} else {
			return false;
		}
	};
	var ee_indexOfValue = function ( list, key, value ) {
		var values = [];
		for ( var x = 0; x < list.length; x++ ) {
			values.push( list[ x ][ key ] );
		}
		return values.indexOf( value );
	}
	var ee_accountAddCharacter = function ( dat, callback ) {
		return ee_UserModel.find( {
			'user': dat[ 'user' ]
		} ).exec( function ( err, res ) {
			if ( err ) {
				return callback( err, false );
			}
			if ( ee_characterAlreadyExists( res[ 0 ].characters, dat[ 'characterName' ] ) ) {
				return callback( 'Character already exists!', false );
			}
			res[ 0 ].characters.push( {
				'name': dat[ 'characterName' ],
				'server': dat[ 'server' ]
			} );
			return res[ 0 ].save( function ( err ) {
				if ( err ) {
					return callback( err, false );
				}
				return callback( undefined, true );
			} );
		} );
	};
	var ee_accountRemoveCharacter = function ( dat, callback ) {
		return ee_UserModel.find( {
			'user': dat[ 'user' ]
		} ).exec( function ( err, res ) {
			if ( err ) {
				return callback( err, false );
			}
			if ( ee_characterAlreadyExists( res[ 0 ].characters, dat[ 'characterName' ] ) ) {
				res[ 0 ].characters.splice( ee_indexOfValue( res[ 0 ].characters, 'name', dat[ 'characterName' ] ), 1 );
				res[ 0 ].save( function ( err ) {
					if ( err ) return callback( err, false );
					return callback( undefined, true );
				} )
			} else {
				return callback( 'No such character.', false );
			}
		} )
	};
	var ee_closeListing = function ( dat, callback ) {
		return ee_ListingModel.find( {
			'listingID': dat[ 'listingID' ]
		} ).exec( function ( err, listing ) {
			if ( listing.length <= 0 ) {
				return callback( 'No such listing with ID: ' + dat[ 'listingID' ], false );
			}
			// console.log("User" + dat['user'] + "Trying to close listing: " + listing[0].listingOwner);
			if ( dat[ 'user' ] === listing[ 0 ].listingOwner ) {
				listing[ 0 ].open = false;
				return listing[ 0 ].save( function ( err ) {
					if ( err ) return callback( err, false );
					return callback( undefined, true );
				} );
			} else {
				return callback( 'Cannot remove a listing that is not your own!', listing[ 0 ] );
			}
		} );
	};
	var ee_editListing = function ( dat, callback ) {
		return ee_ListingModel.findOne( {
			'listingID': dat[ 'listingID' ]
		} ).exec( function ( err, res ) {
			res.listingNotes = ( dat[ 'listingNotes' ] != undefined ) ? dat[ 'listingNotes' ] : res.listingNotes;
			res.tags = ( dat[ 'tags[]' ] != undefined ) ? dat[ 'tags[]' ] : res.tags;
			return res.save( function ( err ) {
				if ( err ) {
					return callback( err, false );
				} else {
					return callback( undefined, dat[ 'listingID' ] );
				}
			} )
		} );
	}
	var ee_removeInvalidFields = function ( fields, validFields ) {
		var ret = [];
		for ( var x = 0; x < fields.length; x++ ) {
			if ( validFields.indexOf( fields[ x ] ) > -1 ) {
				ret.push( fields[ x ] );
			}
		}
		return ret;
	};
	var ee_generateVerificationNumber = function () {
		return 10000 + Math.round( Math.floor() * 90000 )
	}
	var ee_getUserBidsWithListings = function ( dat, callback ) {
		ee_BidModel.find( {
			'user': dat[ 'user' ]
		} ).populate( 'listingRef' ).exec( function ( err, res ) {
			if ( err ) {
				return callback( err );
			}
			return callback( null, res );
		} );
	}
} { //Erinn Exchange Routes / Express Application
	var ee_app = express();
	ee_app.use( sessions( {
		cookieName: 'LoginSession',
		secret: '993W4374tN974S396wB7K7BB86s389G5789M48879P634a883Xc4g74J8DVCM28u',
		duration: 2 * 60 * 60 * 1000,
		activeDuration: 1000 * 60 * 5,
		cookie: {
			path: '/api',
			maxAge: 2 * 60 * 60 * 1000,
			ephemeral: false,
			httpOnly: false,
		}
	} ) );
	ee_app.use( '/public', express.static( __dirname + '/public' ) );
	ee_app.use( '/static', express.static( __dirname + '/static' ) );
	ee_app.use( '/scripts/pure', express.static( __dirname + '/scripts/pure' ) );
	ee_app.use( '/scripts/legacy', express.static( __dirname + '/scripts/legacy' ) );
	ee_app.use( function ( req, res, next ) {
		fs.appendFile( "./access-log.txt", sprintf( "[%s]IP: %s , METHOD: %s, URL: %s\n", ( new Date( Date.now() ) ).toString(), req.connection.remoteAddress, req.method, req.url ), function ( err ) {
			if ( err ) {
				console.log( err ), next();
			}
			return next();
		} );
	} );
	ee_app.use( function ( req, res, next ) {
		fs.appendFile( './access-log.txt', sprintf( "[%s]IP: %s, LoginSession: %s\n", ( new Date( Date.now() ) ).toString(), req.connection.remoteAddress, JSON.stringify( req.LoginSession ) ), function ( err ) {
			if ( err ) {
				console.log( "Access Log: " + err );
				return next();
			}
			return next();
		} );
	} )
	ee_app.use( function ( req, res, next ) {
		if ( req.path.indexOf( '/api/admin' ) > -1 ) {
			fs.appendFile( './admin-log.txt', sprintf( "[%s]IP: %s, Authenticated User: %s, URL: %s, QueryString: %s", new Date( Date.now() ), req.connection.remoteAddress, req.LoginSession != {} ? req.LoginSession.user : "None", req.path, req.params.toString() ), function ( err ) {
				if ( err ) {
					console.log( "Admin Log: " + err );
					return next();
				}
				return next();
			} );
		} else {
			return next();
		}
	} );
	ee_app.use( function ( req, res, next ) {
		var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
		next();
	} )
	var ee_routes = function ( ee_app ) {
			ee_app.get( '/', function ( req, res ) {
				res.sendfile( 'index.html', {
						root: __dirname + '/public'
					} )
					// res.end('Coming Soon...');
			} );
			ee_app.get( '/register*', function ( req, res ) {
				res.redirect( 302, '/' );
			} )
			ee_app.get( '/api/getNewestListings', function ( req, res ) {
				res.type( 'application/json' );
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				if ( containsKeys( dat, [ 'limit' ] ) ) {
					ee_getNewestListings( dat, function ( err, result ) {
						if ( err ) {
							res.end( JSON.stringify( {
								'success': false,
								'error': err.toString()
							} ) );
						}
						res.end( JSON.stringify( {
							'success': true,
							'result': result
						} ) );
					} );
				} else {
					res.end( JSON.stringify( {
						'success': false,
						'error': 'err: missing parameter: limit'
					} ) );
				}
			} );
			ee_app.get( '/api/listNew', function ( req, res ) {
				res.type( 'application/json' );
				if ( req.LoginSession.authenticated ) {
					var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
					console.log( JSON.stringify( dat ) );
					if ( containsKeys( dat, [ 'itemName', 'itemID', 'server', 'tags[]', 'price', 'auction', 'publicAfterClose', 'timeout' ] ) ) {
						if ( dat[ 'price' ] > 50000000 ) {
							return res.end( JSON.stringify( {
								'success': false,
								'error': "Price is too damn high!"
							} ) );
						}
						dat[ 'user' ] = req.LoginSession.user;
						console.log( dat[ 'user' ] === req.LoginSession.user );
						ee_listingAddNew( dat, function ( err, result ) {
							//console.log('ee_listingAddNew returned with ' + err + ' ' + result);
							console.log( err );
							if ( err ) res.end( JSON.stringify( {
								success: false,
								error: err.toString()
							} ) );
							if ( result ) {
								ee_ListingModel.find( {
									user: dat[ 'listingOwner' ]
								} ).sort( {
									listingID: -1
								} ).limit( 1 ).exec( function ( err, result ) {
									if ( err ) {
										console.log( err );
										res.end( JSON.stringify( {
											success: false,
											'error': err.toString()
										} ) );
										return;
									}
									var ret = result[ 0 ].listingID;
									res.write( JSON.stringify( {
										success: true,
										result: 'Listing Submitted!',
										listingID: ret
									} ) );
									return res.end();
								} );
							} else {
								return res.end( JSON.stringify( {
									success: false,
									error: 'failed to create listing!'
								} ) );
							}
						} );
					} else {
						res.end( JSON.stringify( {
							success: false,
							error: 'err: missing parameters!'
						} ) );
					}
				} else {
					res.end( JSON.stringify( {
						success: false,
						error: 'Not logged in.'
					} ) );
				}
			} );
			ee_app.get( '/api/searchListing', function ( req, res ) {
				res.type( 'application/json' );
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				//console.log(dat);
				if ( containsKeys( dat, [ 'auction', 'type[]' ] ) ) {
					if ( ( dat[ 'priceMin' ] == "" || dat[ 'priceMax' ] == "" ) && dat.priceIgnore == undefined ) {
						return res.end( JSON.stringify( {
							'success': false,
							'error': 'err: Price Min/Max are invalid fields',
							'details': dat
						} ) );
					} else if ( dat.priceIgnore != undefined ) {
						dat[ 'priceMin' ] = 0;
						dat[ 'priceMax' ] = 10000000;
					}
					if ( dat[ 'server[]' ] === undefined ) {
						dat[ 'server[]' ] = [ 'Alexina', 'Mari', 'Ruairi', 'Tarlach' ];
					}
					if ( dat[ 'type[]' ][ 0 ] == 0 ) {
						//console.log(dat.type);
						if ( dat[ 'type[]' ][ 1 ] === 'tags' && dat[ 'tags[]' ] != undefined ) {
							//console.log('searching by tags');
							ee_simpleListingSearch( dat, 'tags', function ( err, result ) {
								if ( err ) {
									return res.end( JSON.stringify( {
										success: false,
										error: err.toString()
									} ) );
								}
								return res.end( JSON.stringify( {
									success: true,
									'result': result
								} ) );
							} )
						} else if ( dat[ 'type[]' ][ 1 ] === 'listingOwner' && dat[ 'listingOwner' ] != undefined ) {
							//console.log('searching by listingOwner');
							ee_simpleListingSearch( dat, 'listingOwner', function ( err, result ) {
								if ( err ) {
									return res.end( JSON.stringify( {
										success: false,
										error: err.toString()
									} ) );
								}
								return res.end( JSON.stringify( {
									success: true,
									'result': result
								} ) );
							} );
						} else if ( dat[ 'type[]' ][ 1 ] === 'itemID' && dat[ 'itemID' ] != undefined ) {
							//console.log('searching by itemID');
							ee_simpleListingSearch( dat, 'itemID', function ( err, result ) {
								if ( err ) {
									return res.end( JSON.stringify( {
										success: false,
										error: err.toString()
									} ) );
								}
								return res.end( JSON.stringify( {
									success: true,
									'result': result
								} ) );
							} );
						} else if ( dat[ 'type[]' ][ 1 ] === 'itemName' && dat[ 'itemName' ] != undefined ) {
							//console.log('searching by itemName');
							ee_simpleListingSearch( dat, 'itemName', function ( err, result ) {
								if ( err ) {
									return res.end( JSON.stringify( {
										success: false,
										error: err.toString()
									} ) );
								}
								return res.end( JSON.stringify( {
									success: true,
									'result': result
								} ) );
							} );
						} else if ( dat[ 'type[]' ][ 1 ] === 'listingID' && dat[ 'listingID' ] != undefined ) {
							//console.log('searching by listingID');
							ee_simpleListingSearch( dat, 'listingID', function ( err, result ) {
								if ( err ) {
									return res.end( JSON.stringify( {
										success: false,
										error: err.toString()
									} ) );
								}
								return res.end( JSON.stringify( {
									success: true,
									'result': result
								} ) );
							} );
						} else if ( dat[ 'type[]' ][ 1 ] === 'empty' && dat[ 'emptySearch' ] != undefined ) {
							ee_simpleListingSearch( dat, 'empty', function ( err, result ) {
								if ( err ) {
									return res.end( JSON.stringify( {
										success: false,
										error: err.toString()
									} ) );
								}
								return res.end( JSON.stringify( {
									success: true,
									'result': result
								} ) );
							} );
						} else {
							return res.end( JSON.stringify( {
								success: false,
								error: 'No type specified, or type value not defined!'
							} ) );
						}
					} else {
						//complex search
						// ee_complexListingSearch(dat, dat.type.slice(1), function (err, result) {
						// if (err) {
						// res.end(JSON.stringify({
						// success: false,
						// error: err
						// }));
						// }
						// res.end(JSON.stringify({
						// success: true,
						// results: result
						// }));
						// });
						res.end( JSON.stringify( {
							'success': false,
							'error': 'This functionality reqiures heavy debugging.\n Please use normal searches until the bugs can be fixed.'
						} ) );
					}
				} else {
					res.end( JSON.stringify( {
						'success': false,
						'error': 'err: Missing required fields: type or auction',
						'details': dat
					} ) );
				}
			} );
			ee_app.get( '/api/search', function ( req, res ) {
				res.type( 'application/json' );
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				console.log( dat );
				if ( containsKeys( dat, [ 'type' ] ) ) {
					if ( dat.type == 0 && containsKeys( dat, [ 'id' ] ) ) {
						//search by id
						dat.type = 0;
						ee_getItemByID( escape( dat.id ), function ( err, result ) {
							if ( err ) {
								//console.log(err);
								res.end( JSON.stringify( {
									'success': false,
									error: err.toString()
								} ) );
							}
							res.end( JSON.stringify( {
								'success': true,
								'result': result
							} ) );
						} );
					} else if ( dat.type == 1 && containsKeys( dat, [ 'name' ] ) ) {
						//search by name
						dat.type = 1;
						if ( containsKeys( dat, [ 'exact' ] ) && dat.exact === "true" ) {
							ee_getItemByName( escape( dat.name ), function ( err, result ) {
								if ( err ) {
									//console.log(err);
									res.end( JSON.stringify( {
										'success': false,
										error: err.toString()
									} ) )
								}
								res.end( JSON.stringify( {
									'success': true,
									'result': result
								} ) );
							} );
						} else {
							ee_getItemByNameRegex( escape( dat.name ), function ( err, result ) {
								if ( err ) {
									//console.log(err);
									res.end( JSON.stringify( {
										'success': false,
										error: err.toString()
									} ) )
								}
								res.end( JSON.stringify( {
									'success': true,
									'result': result
								} ) );
							} );
						}
					} else {
						res.end( JSON.stringify( {
							success: false,
							error: 'invalid value for type parameter'
						} ) );
					}
				}
				//console.log(req.header);	res.end('accessed search');
			} );
			ee_app.get( '/api/bid', function ( req, res ) {
				res.contentType( 'application/json' );
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				if ( containsKeys( dat, [ 'listingID', 'bid' ] ) ) {
					if ( req.LoginSession.authenticated === true ) {
						if ( dat[ 'bid' ] > 55000000 ) {
							return res.end( JSON.stringify( {
								'success': false,
								error: 'Bid amount beyond max ceiling for listings.'
							} ) );
						}
						dat[ 'user' ] = req.LoginSession.user;
						ee_makeBid( dat, function ( err, result ) {
							if ( err ) {
								res.end( JSON.stringify( {
									success: false,
									error: err
								} ) );
							} else if ( result == true ) {
								res.end( JSON.stringify( {
									success: true,
									result: true
								} ) );
							} else if ( result == false ) {
								res.end( JSON.stringify( {
									success: true,
									result: false
								} ) );
							}
						} );
					} else {
						res.end( JSON.stringify( {
							success: false,
							error: 'err: Not Logged In.'
						} ) );
					}
				} else {
					res.end( JSON.stringify( {
						success: false,
						error: 'err: missing parameters!'
					} ) );
				}
			} );
			ee_app.get( '/api/priceCheck', function ( req, res ) {
				//console.log(req.header);	res.end('\naccesed priceCheck');
				res.end( 'unimplemented, check back later asshole :(' )
			} );
			ee_app.get( '/api/getBidsByUser', function ( req, res ) {
				res.contentType( 'application/json' );
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				if ( containsKeys( dat, [ 'user' ] ) ) {
					ee_getUserBidsWithListings( dat, function ( err, res ) {
						if ( err ) {
							return res.end( JSON.stringify( {
								'success': false,
								'error': err
							} ) );
						}
						return res.end( JSON.stringify( {
							'success': true,
							'result': res.toString()
						} ) );
					} );
				} else {
					return res.end( JSON.stringify( {
						'success': false,
						'error': 'Missing Parameter: User'
					} ) )
				}
			} );
			ee_app.get( '/api/register', function ( req, res ) {
				res.contentType( 'application/json' );
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				//console.log(dat);
				if ( containsKeys( dat, [ 'user', 'md5', 'email', 'characterName', 'server' ] ) ) {
					//console.log(JSON.stringify(dat));
					ee_userRegister( dat, function ( err, a ) {
						if ( a === true ) {
							res.end( JSON.stringify( {
								'success': true,
								user: dat[ 'user' ],
								email: dat[ 'email' ],
								character: dat[ 'characterName' ],
								server: dat[ 'server' ]
							} ) );
						} else {
							res.end( JSON.stringify( {
								'success': false,
								'error': err
							} ) );
						}
					} );
				} else {
					res.end( JSON.stringify( {
						'success': false,
						'error': 'missing parameters'
					} ) );
				}
			} );
			ee_app.get( '/api/login', function ( req, res ) {
				var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
				res.contentType( 'application/json' );
				if ( containsKeys( dat, [ 'user', 'md5' ] ) ) {
					ee_userValidate( dat[ 'user' ], dat[ 'md5' ], function ( a ) {
						if ( a == true ) {
							// res.cookie('LoggedIn', true, { signed: true, secret : cookieSecret });
							req.LoginSession.authenticated = true;
							req.LoginSession.user = dat[ 'user' ];
							res.end( JSON.stringify( {
								success: true,
								user: req.LoginSession.user,
								auth: req.LoginSession.authenticated
							} ) );
						} else {
							req.LoginSession.authenticated = false;
							res.end( JSON.stringify( {
								success: false,
								user: '',
								auth: req.LoginSession.authenticated
							} ) );
						}
					} );
				} else {
					res.write( 'err: missing parameters' );
					res.end();
				}
			} );
			ee_app.get( '/api/logout', function ( req, res ) {
				res.contentType( 'application/json' );
				req.LoginSession.authenticated = false;
				req.LoginSession.user = undefined;
				res.end( JSON.stringify( {
					'success': true
				} ) );
			} );
			ee_app.get( '/api/loggedIn', function ( req, res ) {
				res.contentType( 'application/json' );
				res.end( JSON.stringify( {
					'loggedIn': req.LoginSession.authenticated,
					'user': req.LoginSession.user
				} ) );
			} );
			ee_app.get( '/api/changelog', function ( req, res ) {
				res.contentType( 'application/json' );
				try {
					fs.readFile( './changelog.txt', function ( err, data ) {
						if ( err ) {
							res.end( JSON.stringify( {
								success: false,
								error: err
							} ) );
						}
						res.end( JSON.stringify( {
							success: true,
							result: JSON.parse( data.toString() )
						} ) )
					} );
				} catch ( e ) {
					res.end( JSON.stringify( {
						success: false,
						error: e.toString()
					} ) )
				}
			} );
			ee_app.get( '/api/account', function ( req, res ) {
				res.contentType( 'application/json' );
				if ( req.LoginSession.authenticated == true ) {
					return ee_getAccountData( req.LoginSession.user, function ( err, result ) {
						if ( err ) {
							return res.end( JSON.stringify( {
								'success': false,
								'error': err
							} ) );
						} else {
							return res.end( JSON.stringify( {
								'success': true,
								'result': result
							} ) );
						}
					} );
				} else {
					return res.end( JSON.stringify( {
						'success': false,
						'error': 'Unauthenticated'
					} ) );
				}
			} );
			ee_app.get( '/api/account/addCharacter', function ( req, res ) {
						res.contentType( 'application/json' );
						var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
						if ( req.LoginSession.authenticated == true ) {
							if ( containsKeys( dat, [ 'characterName', 'server' ] ) ) {
								dat[ 'user' ] = req.LoginSession.user;
								return ee_accountAddCharacter( dat, function ( err, result ) {
									if ( err ) {
										return res.end( JSON.stringify( {
											'success': false,
											'error': err.toString()
										} ) );
									} else {
										return res.end( JSON.stringify( {
											'success': true,
											'result': result
										} ) );
									}
								} );
							} else {
								return res.end( JSON.stringify( {
									'success': false,
									'error': 'Missing parameters: characterName or server'
								} ) );
							}
						} else {
							return res.end( JSON.stringify( {
									'success': false,
									'error': 'Unauthenticated'
								}
							} );
							ee_app.get( '/api/account/removeCharacter', function ( req, res ) {
								res.contentType( 'application/json' );
								var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
								if ( req.LoginSession.authenticated == true ) {
									if ( containsKeys( dat, [ 'characterName' ] ) ) {
										dat[ 'user' ] = req.LoginSession.user;
										return ee_accountRemoveCharacter( dat, function ( err, result ) {
											if ( err ) {
												return res.end( JSON.stringify( {
													'success': false,
													'error': err.toString()
												} ) );
											} else {
												return res.end( JSON.stringify( {
													'success': true,
													'result': result
												} ) );
											}
										} );
									} else {
										return res.end( JSON.stringify( {
											'success': false,
											'error': 'Missing parameters: characterName'
										} ) );
									}
								} else {
									return res.end( JSON.stringify( {
										'success': false,
										'error': 'Unauthenticated'
									} ) );
								}
							} );
							ee_app.get( '/api/account/closeListing', function ( req, res ) {
								res.contentType( 'application/json' );
								var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
								if ( req.LoginSession.authenticated == true ) {
									if ( containsKeys( dat, [ 'listingID' ] ) ) {
										dat[ 'user' ] = req.LoginSession.user;
										return ee_closeListing( dat, function ( err, result ) {
											if ( err ) return res.end( JSON.stringify( {
												'success': false,
												'error': err.toString(),
												'data': result
											} ) );
											return res.end( JSON.stringify( {
												'success': true,
												'result': true
											} ) );
										} );
									} else {
										return res.end( JSON.stringify( {
											'success': false,
											'error': 'Missing parameter: listingID'
										} ) );
									}
								} else {
									return res.end( JSON.stringify( {
										'success': false,
										'error': 'Unauthenticated'
									} ) );
								}
							} );
							ee_app.get( '/api/account/editListing', function ( req, res ) {
								res.contentType( 'application/json' );
								var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
								console.log( 'EDIT:' + JSON.stringify( dat ) );
								if ( req.LoginSession.authenticated == true ) {
									if ( containsKeys( dat, [ 'listingID', 'fields[]' ] ) == true ) {
										ee_removeInvalidFields( dat[ 'fields[]' ], [ 'tags[]', 'listingNotes' ] );
										return ee_editListing( dat, function ( err, result ) {
											if ( err ) {
												return res.end( JSON.stringify( {
													success: false,
													error: err.toString()
												} ) );
											} else {
												return res.end( JSON.stringify( {
													success: true,
													'result': result
												} ) );
											}
										} );
									} else {
										return res.end( JSON.stringify( {
											success: false,
											error: 'Missing parameters: listingID, fields'
										} ) )
									}
								} else {
									return res.end( JSON.stringify( {
										success: false,
										error: "Unauthenticated"
									} ) )
								}
							} );
							ee_app.get( '/api/admin/removeListing', function ( req, res ) {
								res.contentType( 'application/json' );
								return res.end( JSON.stringify( {
									'success': false,
									'error': "Not Implemented"
								} ) );
								var dat = ( url.parse( req.url ).query != null ) ? querystring.parse( url.parse( req.url ).query ) : {};
								if ( req.LoginSession.user != "Maldaris" ) {
									return res.end( JSON.stringify( {
										'success': false,
										'error': "Not Logged in as Administrator."
									} ) );
								} else {
									if ( containsKeys( dat, [ 'listingID' ] ) ) {
										return removeListing( dat, function ( err, result ) {
											if ( err ) {
												return res.end( JSON.stringify( {
													'success': false,
													'error': err
												} ) );
											}
											return res.end( JSON.stringify( {
												'success': true,
												'result': result
											} ) );
										} );
									} else {
										return res.end( JSON.stringify( {
											'success': false,
											'error': "missing listingID"
										} ) );
									}
								}
							} );
						}
					}

					ee_routes( ee_app );
					var debug = true;
					var port = 80; express()
					.use( vhost( 'unaccompaniedminers.com', um_app ) )
					.use( vhost( 'erinnexchange.com', ee_app ) )
					.listen( port );
