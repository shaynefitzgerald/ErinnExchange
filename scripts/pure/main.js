var getValuesByKeys = function (data, keys) {
	ret = [];
	keys.forEach(function (a) {
		ret.push(data[a]);
	})
	return ret;
}

function MenuButton(element, callback) {
	this.element = element;
	$(this.element).click(callback);
}

function ContentElement(data, html, manager) {
	jQuery.extend(this, data);
	this.dataKeys = data['formatOrder'];
	//console.log(this.dataKeys);
	// this.dataKeys.forEach(function (a) {
		// console.log(data[a]);
	// })
	this.html = html;
	this.identifier = data['id'];
	this.parent = manager.element;
	this.manager = manager;
}

function ContentFactory(onCreate, onDestroy) {
	this.defaultCreate = function (contentElement) {
		contentElement.parent.append(vsprintf(contentElement.html, getValuesByKeys(contentElement, contentElement.dataKeys)));
	};
	this.defaultDestroy = function (contentElement) {
		contentElement.parent.remove(contentElement.id);
	};
	if (onCreate) {
		this.onCreate = onCreate;
	} else {
		this.onCreate = this.defaultCreate;
	}
	if (typeof onDestroy === 'function') {
		this.onDestroy = onDestroy;
	} else {
		this.onDestroy = this.defaultDestroy;
	}
}

function ContentManager(element, factory, clearMethod) {
	this.element = element;
	this.factory = factory;
	this._clear = clearMethod;
	this.elements = [];
};
ContentManager.prototype.insert = function (contentElement) {
	this.elements.push(contentElement);
	this.factory.onCreate(contentElement);
}
ContentManager.prototype.clear = function () {
	if (typeof this._clear === 'function') {
		this._clear();
	} else {
		delete this.elements;
		this.elements = [];
		this.element.empty();
	}
}
var uiManager = new ContentManager($('.content'), new ContentFactory(function (contentElement) {
	uiManager.clear();
	this.defaultCreate(contentElement);
}, function (contentElement) {
	this.defaultDestroy(contentElement);
}), false);

var setLoginState = function(state){
	if(state == true){
		$('.onLoginShow').trigger('login');
		$('.onLoginHide').trigger('login');
	} else {
		$('.onLoginShow').trigger('logout');
		$('.onLoginHide').trigger('logout');
	}
}

var UIClientSessionContainer = {
	lastListingSubmission : -1,
	lastBidSubmission : -1,
};

var UIAccountHandler = function(){
	apiIsLoggedIn({}, function(res){
		if(res.loggedIn == true){
			apiGetAccountData({}, function(res){
				$('#accountContent').append(res);
				$('#AddCharacterSubmit').click(function(event){
					event.preventDefault();
					var opt = {};
					opt['characterName'] = $('#CharacterInput').val();
					opt['server'] = $('#ServerSelect').val();
					return apiAccountAddCharacter(opt, function(res){
						if(res.success != true){
							$('#SubmitResult').empty();
							$('#SubmitResult').append('Character failed to add with error: ' + res.error.toString());
						} else {
							$('#SubmitResult').empty();
							$('#SubmitResult').append("Character added!");
						}
					});
				});
				
			});
		} else {
			$('#accountContent').append(compileHTML("Your login session has expired, please re-login.", formatError));
		}
	});
};
var UIAccountRemoveCharacterHandler = function(name){
	return apiAccountRemoveCharacter({'characterName' : name}, function(res){
		if(res.success == true){
			uiManager.clear();
			uiManager.insert(UIAccount);
		} else {
			$('div#removeCharacterResult').clear();
			$('div#removeCharacterResult').append(res.error);
		}
	});
};
var UIAccountInspectListingHandler = function(listingID, server, open){
	//console.log("CLICKED:",listingID, server)
	return apiSearchListings({type : [0, 'listingID'], 'listingID' : listingID, 'auction' : true, priceIgnore : true, 'open' : open }, function(res){
		if(res.success == false){
			uiManager.clear();
			uiManager.insert(UIStandardError);
			$('#ErrorElement').html(res.error.toString());
		} else if(res.success === true  && res.result == false) {
			uiManager.clear();
			uiManager.insert(UIStandardError);
			$('#ErrorElement').html("Cannot find the specified listing. Contact Site Admin with listing ID: "+listingID.toString());
		} else if(res.success === true && Array.isArray(res.result)){
			var dataHide = res.result[0];
			uiManager.clear();
			uiManager.insert( new ContentElement({
				id : 'detailedListing',
				formatOrder : ['header','parsedData','ButtonHandlerInject'],
				ButtonHandlerInject : "<script>UIDetailedViewBidHandler()</script>",
				parsedData : formatDetailedListing(dataHide),
				header : unescape(dataHide.itemName)
			}, "<div><h2 class='content-subhead center-div'>%s</h2>%s</div>%s", uiManager));
		}
	}, 1);
};
var UIAccountCloseListingHandler = function(listingID){
	return apiCloseListing({'listingID': listingID}, function(res){
		if(res.success == true){
			$('#closeResult').empty();
			$('#closeResult').append(sprintf('Listing with ID %s closed successfully', listingID));
		} else {
			$('#closeResult').empty();
			$('#closeResult').append(res.error);
		}
	});
};
var UIDetailedViewClickHandler = function(element, hide){
	var dataHide = (hide == undefined) ? JSON.parse(element.parents('div.itemListingPadding').find('div.DataHide').html()) : hide ;
	uiManager.clear();
	uiManager.insert( new ContentElement({
		id : 'detailedListing',
		formatOrder : ['header','parsedData','ButtonHandlerInject'],
		ButtonHandlerInject : "<script>UIDetailedViewBidHandler()</script>",
		parsedData : formatDetailedListing(dataHide),
		header : unescape(dataHide.itemName)
	}, "<div><h2 class='content-subhead center-div'>%s</h2>%s</div>%s", uiManager));
}
var UIDetailedViewBidHandler = function(){
	if(JSON.parse($('.DataHide').html()).open == false){
		$('.bidDataDetailed').empty();
		$('.bidDataDetailed').append(UIFeedback);
	}
	$('#bidPlace').click(function(event){
		event.preventDefault();
		var dataHide = JSON.parse($('#detailedDataHide').html());
		if(Number($('#bidAmt').val()) >= Number(findHighestBid(dataHide.bids).amount + dataHide.minBid)){
			var dat = {}
			dat['bid'] = $('#bidAmt').val();
			try {
				dat['listingID'] = JSON.parse($('#detailedDataHide').html()).listingID;
			} catch (e){
				console.error(e);
				return $('#bidError').append(compileHTML(e.toString(), formatCompactError));
			}
 			return apiPlaceBid(dat, function(res){
				$('#bidError').append((res.success == true) ? "<div class=pure-u-1>Bid successfully placed!</div>" : compileHTML(res.error, formatCompactError));
			});
		} else {
			return $('#bidError').append(compileHTML('Error: Bid value too low', formatCompactError));
		}
	})
}
var UIFeedbackHandler = function(element){

}
var UIDetailedViewIDHandler = function(id){
	return apiSearchListings({
		'type' : [0, 'listingID'],
		'listingID' : id,
		'priceIgnore' : true,
		'auction' : true
	}, function(res){
		UIDetailedViewClickHandler(null, res.result[0]);
	}, false)
}
var UIEditListingHandler = function(){
	return apiGetAccountData({}, function(res){
		if(res.success == false){
			if(res.error == 'Unauthenticated'){
				setLoginState(false);
				uiManager.clear();
				uiManager.insert(UILogin);
			} else {
				$('#EditError').empty();
				$('#EditError').append(res.error.toString());
			}
		}
		return apiSearchListings({type : [0, 'listingOwner'], listingOwner : res.user, auction : true, priceIgnore : true, open:true},
		function(res){
			console.log(res);
			if(res.success == true){
				$('#listingSelect').append(formatEditSelectOptions(res.result));
				var selectedIndex = Number($('#EditListing option:selected').data('index'));
				var initial = formatDetailedListing(res.result[selectedIndex])
				$('#listingDataInsert').append(initial);
				$('.bidDataDetailed').empty();
				$('#EditListing').change(function(event){
					$('#listingDataInsert').empty();
					selectedIndex = Number($('#EditListing option:selected').data('index'));
					$('#listingDataInsert').append(formatDetailedListing(res.result[selectedIndex]));
					$('.bidDataDetailed').empty();
				});
				$('#EditSubmit').click(function(event){
					event.preventDefault();
					var dat = {'listingID' : res.result[selectedIndex].listingID, 'fields' : [] };
					($('#EditTags').val() != "") ? dat['fields'].push('tags')  : console.log('No tags') ;
					($('#EditNotes').val() != "") ? dat['fields'].push('listingNotes') : console.log('No notes');
					(dat.fields.indexOf('tags') > -1) ? dat['tags'] = parseTags($('#EditTags').val()) : console.log('');
					(dat.fields.indexOf('listingNotes') > -1) ? dat['listingNotes'] = $('#EditNotes').val() : console.log('');
					apiEditListing(dat, function(err, result){
						if(err){
							$('#EditError').empty();
							$('#EditError').append(compileHTML(err, formatCompactError));
						} else {
							$('#EditError').empty();
							$('#EditError').append(sprintf('Listing Edited successfully! View it <a href="#" onclick="UIDetailedViewIDHandler(%s)">here</a>', result))
						}
					});
				});
			} else {
				$('#EditError').empty();
				$('#EditError').append(res.error.toString());
			}
		}, true);
	}, true);
};
var UITagClickHandler = function(element){
	var tag = element.html();
	uiManager.clear();
	uiManager.insert(UISearchListing);
		$('#typeSelect option[value="byTags"]').prop('selected', 'true').trigger('change');
		$('#listingTags').val(tag.toString());
}
var UISearchListingHandler = function(){
	$('#listingSearchSubmit').click(function(event){
			try{
				event.preventDefault();
				var selected = $('#typeSelect option:selected').val();
				var dat = {type : [0] , auction : true};
				dat['server'] = [];
				if($('#serverAlexina').prop('checked') === true) { dat['server'].push('Alexina'); }
				if($('#serverMari').prop('checked') === true) { dat['server'].push('Mari'); }
				if($('#serverRuairi').prop('checked') === true) { dat['server'].push('Ruairi'); }
				if($('#serverTarlach').prop('checked') === true) { dat['server'].push('Tarlach'); }
				dat['priceMin'] = $('#priceTextMin').val() == "" ? $('#priceSliderMin').val() : $('#priceTextMin').val();
				dat['priceMax'] = $('#priceTextMax').val() == "" ? $('#priceSliderMax').val() : $('#priceTextMax').val();
				if(selected == "byOwner"){
					if($('#listingByOwner').val() != ""){
						dat['type'].push('listingOwner');
						dat['listingOwner']  = $('#listingByOwner').val();
						dat['exact'] = $('#OwnerNameExactMatch').is(':checked');
					} else {
						dat['type'].push('empty');
						dat['emptySearch'] = true;
					}
				} else if(selected == "byItem"){
					if($('#ItemName').val() != ""){
						dat['itemName'] = $('#ItemName').val();
						dat['type'].push('itemName');
						dat['exact'] = $('#OwnerNameExactMatch').is(':checked');
					} else if($('#ItemID').val() != "") {
						dat['itemID'] = $('#ItemID').val();
						dat['type'].push('itemID');
					} else if($('#ItemID').val() == "" && $('#ItemName').val() == ""){
						dat['type'].push('empty');
						dat['emptySearch'] = true;
					}
				} else if(selected == 'byTags'){
					if($('#listingTags').val() != ""){
						dat['tags']  = $('#listingTags').val().split(',');
						dat['type'].push('tags');
					} else {
						dat['type'].push('empty');					
						dat['emptySearch'] = true;
					}
				}
				return apiSearchListings(dat, function(res){
					console.log(res.result);
					$('div.searchEntryPoint').empty();
					return $('div.searchEntryPoint').append(res);
				});
			} catch (e){
				$('div.searchEntryPoint').empty();
				console.log(e);
				return $('div.searchEntryPoint').append(compileHTML(e.toString(), formatError));
			}
		})
	$(document).ready(function(){
		$('#priceSliderMin').on('input', function(){
			$('#priceTextMin').val($('#priceSliderMin').val());
		});
		$('#priceTextMin').keyup(function(){
			console.log(parseInt($('#priceTextmin').prop('value')));
			$('#priceSliderMin').prop('value', parseInt($('#priceTextMin').prop('value')))
		})
		$('#priceSliderMax').on('input', function(){
			$('#priceTextMax').val($('#priceSliderMax').val());
		});
		$('#priceTextMax').keyup(function(){
			$('#priceSliderMax').prop('value', parseInt($('#priceTextMax').prop('value')))
		});
		$('#priceSliderMax').val(50000000);
		$('#priceSliderMin').val(0);
		$('#priceTextMin').val(0);
		$('#priceTextMax').val(50000000)
		$('#optionContainer').empty();
		$('#optionContainer').append(["",
		"	<input type='text' id='ItemName' placeholder='By Item Name'></input>",
		"	<input type='text' id='ItemID' placeholder='By Item ID'></input>",
		"	<label for='ItemNameExactMatch'>",
		"		<input type=checkbox id='ItemNameExactMatch'>Exact Match</input>",
		"	</label>",
		"",
		].join('\n'));
		$('form.pure-form').on('change', '#typeSelect', function(){
			var selected = $('#typeSelect option:selected').val();
			if(selected == "byOwner"){
				$('#optionContainer').empty();
				$('#optionContainer').append("<input type='text' id='listingByOwner' placeholder='By Owner'>\
				<label for='OwnerNameExactMatch'><input id='OwnerNameExactMatch' type='checkbox'> Exact Match</label>");
			} else if(selected == "byItem"){
				$('#optionContainer').empty();
				$('#optionContainer').append(["",
					"	<input type='text' id='ItemName' placeholder='By Item Name'></input>",
					"	<input type='text' id='ItemID' placeholder='By Item ID'></input>",
					"	<label for='ItemNameExactMatch'>",
					"		<input type=checkbox id='ItemNameExactMatch'>Exact Match</input>",
					"	</label>",
					"",
					].join('\n'));
			} else if(selected ==='byPrice'){
				$('#optionContainer').empty();			
				$('#optionContainer').append("<select id='priceOperator'><option value='lt'>Less than</option>\
				<option value='eq'>Equal to</option><option value='gt'>Greater than</option></select>\
				<input type='text' id='listingPrice' placeholder='Price'></input>");
			} else if(selected == 'byTags'){
				$('#optionContainer').empty();
				$('#optionContainer').append("<input type='text' id='listingTags' placeholder='Tags'></input>");
			}
		})
		
	})
}
var UIItemDBSearchHandler = function(){
	$('#dbSearchSubmit').click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		var dat = {};
		dat['type'] = ($('#dbByID').val()) ? 0 : (($('#dbByName').val()) ? 1 : -1);
		if (dat['type'] === 0) {
			dat['id'] = Number($('#dbByID').val());
		} else if (dat['type'] === 1) {
			dat['name'] = $('#dbByName').val();
		} else {
			return alert('Input fields cannot be empty.');
		}
		dat['exact'] = $('#exactMatch').is(':checked');
		apiSearchDatabase(dat, function(res){
			$('.searchEntryPoint').empty()
			$('.searchEntryPoint').append(res);
		});
	});
}
var UICreateListingHandler = function(){
	$('#listingCreateSubmit').click(function(event){
		event.preventDefault();
		var loadRest = function(dat){
			if($('#listingPrice').val() != ""){
				dat['price'] = $('#listingPrice').val();
			} else {
				throw Error("Price not specified!");
			}
			if($('#listingMinBid').val() != ""){
				dat['minBid'] = $('#listingMinBid').val();
			} else {
				dat['minBid'] = $('#listingPrice').val() * .1;
			}
			dat['tags'] = parseTags($('#listingTags').val());
			dat['listingNotes'] = $('#listingNotes').val();
			dat['publicAfterClose'] = $('#publicAfterClose').val() == 'on' ? true : false;
			dat['server'] = $('#serverSelect').val();
			dat['timeout'] = $('#durationSelect').val();
			dat['auction'] = true; // for now at least.
			console.log(dat);
			return apiSubmitListing(dat, function(res){
				$('#createResult').empty();
				$('#createResult').append(res.toString());
			});
		};
		var dat = {};
		if($('#itemName').val() != "" && $('#itemID').val() != ""){
			apiGetItemNameByID(Number($('#itemID').val()), function(err, res){
				if(err) {
					$('#createResult').empty();
					return $('#createResult').append(res);
				} else {
					if(res != $('#itemName').val()){
						return alert('The ID and Name specified have conflicting results in the Database.\n Please use one or the other.');
					} else {
						dat['itemName'] = res;
						dat['itemID'] = Number($('#itemID').val());
						loadRest(dat);
					}
				}
			});
		} else if($('#itemID').val() != ''){
			console.log('call getnamebyid');
			apiGetItemNameByID(Number($('#itemID').val()), function(err, res){
				if(err) {
					$('#createResult').empty();
					return $('#createResult').append(err.toString());
				} else {
					dat['itemName'] = res;
					dat['itemID'] = Number($('#itemID').val());
					loadRest(dat);
				}
			});
		} else if($('#itemName').val() != ''){
			apiGetItemIDByName($('#itemName').val(), function(err, res){
				if(err){
					$('#createResult').empty();
					return $('#createResult').append(err.toString());
				}
				dat['itemID'] = res;
				dat['itemName'] = $('#itemName').val();
				loadRest(dat);
			});
		} else {
			return alert('Specify an Item Name or ID');
		} 
	});
}
var UILoginHandler = function(){
	$('#submitLogin').click(function(event){
		event.preventDefault();
		var dat = {};
		dat['user'] = $('#loginUsername').val();
		dat['md5'] = md5($('#loginPassword').val());
		return apiLogin(dat, function(err, res){
			if(err){
				console.log(err);
				$('#loginError').html(err.toString());
			} else if(res == true){
				$('#loginError').html('Login Successful!');
				setLoginState(true);
				setTimeout(function(){
					uiManager.clear();
					uiManager.insert(UIHome);
				}, 2500)
			} else {
				$('#loginError').html('Login Failed!');
			}
			
		});
	});
};
var UILogoutHandler = function(){
	return apiLogout({}, function(res){
		$('#logoutError').append((res.success == true) ? "Logged out! Redirecting to Homepage..." : "Error");
		if(res.success == true){
			setLoginState(false);
		}
		setTimeout(function(){
			uiManager.clear();
			uiManager.insert(UIHome);
		}, 2500)
	});
}
var UIChangelogHandler = function(){
	return apiGetChangelog({}, function(res){
		$('.changelogEntryPoint').empty();
		$('.changelogEntryPoint').append(res);
	})
}
var UIRegisterHandler = function(){
	$('#submitRegister').click(function(event){
		event.preventDefault();
		try {
			var errOut = function(err){
				throw err;
			}
			event.preventDefault();
			var dat = {};
			dat['user'] = $('#username').val().length > 0 ? $('#username').val() : errOut(new Error('Username field cannot be empty.'));
			if($('#password').val() != $('#password2').val()){
				errOut(new Error('Passwords do not match.'));
			}
			dat['md5'] = $('#password').val().length > 8 ? md5($('#password').val()) : errOut(new Error('Password must be longer than 8 characters.'));
			dat['email'] = validateEmail($('#email').val()) ? $('#email').val() : errOut(new Error('Enter a valid email.'));
			dat['characterName'] = $('#characterName').val().length > 0 ? $('#characterName').val() : errOut(new Error('Character name cannot be empty.'));
			dat['server'] = $('#serverSelect option:selected').val();
			return apiRegister(dat, function(res){
				$('#result').append(res);
			});
		} catch(e){
			console.log(e);
			$('#result').append(e.toString());
		}
	});
}
var UICreateListingDisambiguationHandler = function(element){
	$('input#itemName').val(element.data('name'));
	$('input#itemID').val(element.data('id'));
	$('#createResult').empty();
};

var UIEditListing = new ContentElement({
	id : 'UIEditListing',
	formatOrder : ['UIEditListingHandlerInject'],
	UIEditListingHandlerInject : "<script>UIEditListingHandler()</script>"
}, UIEditListingTemplateHTML, uiManager);
var UIStandardError = new ContentElement({
	id : 'StandardError',
	formatOrder : [],
},standardErrorTemplateHTML, uiManager)
var UIItemDB = new ContentElement({
	id: 'itemDBSearch',
	formatOrder : ['searchHandlerInject'],
	searchHandlerInject : "<script>UIItemDBSearchHandler()</script>"
}, itemDBTemplateHTML ,uiManager);
var UIHome = new ContentElement({
	id: 'HomeUI',
	formatOrder: ['aboutText', 'listingEntryPoint'],
	'aboutText': aboutTextTemplateHTML,
	'listingEntryPoint': "<script id='listingInject'>apiGetNewestListings(function(a){ $('.listingEntryPoint').empty(); $('.listingEntryPoint').append(a);});</script>"
}, homeTemplateHTML ,uiManager);
var UICreateListing = new ContentElement({
	id : 'createListingForm',
	formatOrder : ['submitHandlerInject'],
	submitHandlerInject : "<script>UICreateListingHandler()</script>"
}, listingCreateTemplateHTML, uiManager);
var UISearchListing = new ContentElement({
	id : 'searchListing',
	formatOrder : ['submitHandlerInject'],
	submitHandlerInject : '<script>UISearchListingHandler()</script>',
}, listingSearchTemplateHTML, uiManager);
var UILogin = new ContentElement({
	id : 'loginForm',
	formatOrder : ['loginHandlerInject'],
	loginHandlerInject : "<script>UILoginHandler()</script><div id=loginError></div>"
}, loginTemplateHTML, uiManager);
var UIAbout = new ContentElement({
	id : 'aboutUI',
	formatOrder : ['aboutText','changelogInject'],
	changelogInject : "<script>UIChangelogHandler()</script>",
	aboutText : aboutTextTemplateHTML
}, aboutTemplateHTML, uiManager);
var UILogout = new ContentElement({
	id : 'logoutNotify',
	formatOrder : ['logoutHandlerInject'],
	logoutHandlerInject : "<script>UILogoutHandler()</script>"
}, "%s<div class=center-div id=logoutError></div>", uiManager);
var UIAccount = new ContentElement({
	id : "",
	formatOrder : ['accountClickInject'],
	accountClickInject : "<script>UIAccountHandler()</script>"
}, accountTemplateHTML, uiManager);
var UIRegister = new ContentElement({
	id : 'registration',
	formatOrder : ['registerHandlerInject'],
	registerHandlerInject : "<script>UIRegisterHandler()</script>"
}, registerTemplateHTML ,uiManager);

var MenuKnot = new MenuButton($('a.pure-menu-heading'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIHome);
});
var MenuCreateListing = new MenuButton($('#UICreateListing'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UICreateListing);
});
var MenuSearchListing = new MenuButton($('#UISearchListing'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UISearchListing);
});
var MenuEditListing = new MenuButton($('#UIEditListing'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIEditListing);
});
var MenuHome = new MenuButton($('#UIHome'), function (event) {
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIHome);
});
var MenuSearchDB = new MenuButton($('#UIItemDB'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIItemDB);
});
var MenuLogin = new MenuButton($('#UILogin'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UILogin);
});
var MenuLogout = new MenuButton($('#UILogout'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UILogout);
});
var MenuAbout = new MenuButton($('#UIAbout'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIAbout);
});
var MenuAccount = new MenuButton($('#UIAccount'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIAccount);
})
var MenuRegister = new MenuButton($('#UIRegister'), function(event){
	event.preventDefault();
	uiManager.clear();
	uiManager.insert(UIRegister);
})
$(document).on('ready', function () {
	uiManager.insert(UIHome);
	$('li.onLoginShow').hide();
	$('.onLoginHide').on('login', function(e){
		$(this).hide();
	});
	$('.onLoginHide').on('logout', function(e){
		$(this).show();
	});
	$('.onLoginShow').on('login', function(e){
		$(this).show();
	});
	$('.onLoginShow').on('logout', function(e){
		$(this).hide();
	});
	apiIsLoggedIn({}, function(res){
		if(res.loggedIn == true){
			return setLoginState(true);
		} else {
			return setLoginState(false);
		}
	});
});