var mongoose = require('mongoose');

exports.init = function(db){
	function addDays(myDate,days) {
		return new Date(myDate.getTime() + days*24*60*60*1000);
	}
	exports.ee_BidModel = db.model('BidModel', new mongoose.Schema({
		user : String,
		amount : Number,
		listingID : Number,
		listingRef : {type : mongoose.Schema.Types.ObjectId, ref : 'ListingModel'}
	}));
	// exports.BidModel = mongoose.model('BidModel', bidSchema);
	exports.ee_ItemModel = db.model('ItemModel', new mongoose.Schema({
		id : Number,
		iconSrc :  { type : String, default : '/static/no_icon.png' },
		mwwLink : String,
		name : String,
		description : String,
	}));
	//exports.itemSchema = itemSchema;
	// exports.itemModel = mongoose.model('ItemModel', itemSchema);
	exports.ee_ListingModel = db.model('ListingModel', new mongoose.Schema({
		listingID : { type: Number, unique: true},
		itemName : String,
		listingOwner : String,
		itemID : Number,
		tags : [String],
		timestamp : { type : Date, default : new Date(Date.now()) },
		price : Number,
		auction : Boolean,
		server : String,
		publicAfterClose : Boolean,
		minBid : Number,
		bids : [{ type : mongoose.Schema.Types.ObjectId, ref : 'BidModel' }],
		open : { type : Boolean , default : true },
		timeout : { type : Date },
		listingNotes : {type : String , default : "No addtional notes, see tags for info."},
		itemData : { type : mongoose.Schema.Types.ObjectId , ref : 'ItemModel' },
		listingCompleteVerification : { type : Number , unique : true },
	}));
	// exports.userAccount = userAccount;
	// exports.listingModel = mongoose.model('listingModel', listingSchema);
	exports.ee_UserModel = db.model('UserModel', new mongoose.Schema({
		user : { type :  String, unique : true },
		md5 : String,
		email : { type : String, unique : true },
		characters : { type : [{ name : String, server : String}], unique : true } ,
		listings : [{type : mongoose.Schema.Types.ObjectId, ref : 'ListingModel'}],
		bids : [{type : mongoose.Schema.Types.ObjectId, ref : 'BidModel'}],
		accountChangeFlags : [String],
	}));
	// exports.listingSchema = listingSchema;
	// exports.userModel = mongoose.model('userModel', userAccount);
} 