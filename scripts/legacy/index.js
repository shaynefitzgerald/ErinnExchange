var modalDefaultCSS = {
	'height': '150px',
	'width': '300px',
};
String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};
var removeSpaces = function(a){
	return a.replace(/\s+/g, '');
};
var intpx = function (a) {
	return "" + a + "px";
};
var hideSplash = function () {
	$('.splash').hide();
};
var showModal = function (html, onClick, numButtons) {
	if(numButtons){
		//numButtons is really the number of onClick functions are passed to the function
		$('div.modal').modal({
			onShow: function(dialog){
				dialog.data.append(html);
				for(var x = 0; x < numButtons; x++){
					$('#modalSubmit'.concat(x.toString())).click(onClick.pop());
				}
			},
		});
	} else {
		$('div.modal').modal({
			onShow: function (dialog) {
				dialog.data.append(html);
				$('#modalSubmit').click(onClick);
			}
		});
	}
};
var scaleModal = function (scaleH, scaleW) {
	var a = parseInt(modalDefaultCSS.height, 10),
		b = parseInt(modalDefaultCSS.width, 10);
	if (scaleW === undefined) {
		$('.modal').css('height', intpx(a * scaleH));
		$('.modal').css('width', intpx(b * scaleH));
	} else {
		$('.modal').css('height', intpx(a * scaleH));
		$('.modal').css('width', intpx(b * scaleW));
	}
	return;
};
var loadAbout = function(){

};
var utilityLCFDataInsert = function(name, id, src){

};
var ListingCreateForm = function(data, fromTable){
	if(fromTable){
		var row = $("#"+fromTable).parent().parent();
		console.log(row);
		var name = row.find("td:nth-child(4)").html();
		var id  = row.find("td:first").html();
		scaleModal(2,1);
		var modifiedView = createListingWItemEntry;
		modifiedView.replace("%1", name);
		modifiedView.replace("%2", id);
		console.log(modifiedView);
		showModal(modifiedView, function(event){
			$.modal.close();
		});
	} else {
		scaleModal(2,1);
		var modifiedView = createListingWItemEntry;
		modifiedView.replace("%1", name);
		modifiedView.replace("%2", id);
		showModal(modifiedView, function(event){
			$.modal.close();
		});
	}
};
var lnavButtons = {
	'Find a Listing' : function() {
	
	},
	'Search Item Database' : function() {
	
	},
	'Create Listing' : function(){
		console.log('clicked');
		scaleModal(2,1);
		hideSplash();
		var errOut = function(err){
			scaleModal(2, 1);
			$('#searchError').empty();
			$('#searchError').append(badSearch);
			$('#searchErrorMsg').append(err.toString());
			return 'error'
		};
		showModal(initialSearchHtml,[ function(event){
			console.log('searching by name')
			var opt = {
				type : 1, 
				name : ($('#SearchBar').val() != "") ? $('#SearchBar').val() : errOut('Search bar cannot be empty!'),
				exact : $('#searchCheckbox').is(":checked")
			};
			if(opt.name == "error"){ return; }
			callAJAX(rootSite + '/api/search?', opt , function(data){
				if(data.success === false && data.error){
					errOut(data.error.toString());
				} else if(data.itemEntry === undefined || data.success === false){
					errOut("Sorry, no item could be found with that name!");
				} else {
					$.modal.close();
					var opt = {
						headers : ['ID', 'Icon', 'Wiki Link', 'Name', 'Description'],
						itemEntry : data.itemEntry,
					};
					showItemEntries(opt, function(tableID){
						console.log('made it to the callback');
						var table = $('#'+tableID);
						var header = table.find('tr > th').parent();
						var rows = table.find('tr > td').parent();
						header.append("<th>Create Listing</th>");
						rows.each(function(i){
							$(this).append('<td><a href="#" id="newListingRow' + i + '" >New Listing</a>');
							$(this).find("a#newListingRow"+String(i)).click(function(event){
								event.preventDefault();
								return ListingCreateForm(null, "newListingRow"+String(i));
							});
						});
					});
				}
			});
		}, function(event){
			console.log('searching by id');
			var opt = { type : 0, id : ($('SearchBar').val() != "") ? $('#SearchBar').val() : errOut('Search bar cannot be empty!') };
			callAJAX(rootSite + '/api/search?', opt , function(data){
				if(data.success === false && data.error){
					errOut(data.error.toString());
				} else if(data.itemEntry === undefined || data.success === false){
					errOut("Sorry, no item could be found with that ID!");
				} else {
					$.modal.close();
					ListingCreateForm(data.itemEntry, false);
				}
			});
		}], 2);
	},
	'Register': function () {
		hideSplash();
		var errOut = function (err) {
			scaleModal(2, 1);
			$('#registerResult').append('<b>err:</b> ' + err);
		};
		scaleModal(1.5, 1);
		showModal(registerHtml, function (event) {
			$('#registerResult').html('');
			var iuser = ($('#registerUsername').val());
			if (iuser.length <= 0) {
				return errOut('username cannot be empty');
			}
			if ($('#registerPassword1').val() != $('#registerPassword2').val()) {
				return errOut('passwords must match');
			}
			var ipassword = ($('#registerPassword1').val().length >= 8) ? (md5($('#registerPassword1').val())) : errOut('Password must be longer than 8 characters.');
			var icharacter = ($('#registerCharName').val());
			if (icharacter.length <= 0) {
				return errOut('Character field cannot be empty');
			}
			var iserver = $('#registerSelectServer').val();
			console.log(iserver);
			if(iserver === undefined){
				return errOut('Select a server');
			}
			var iemail = (validateEmail($('#registerEmail').val())) ? $('#registerEmail').val() : errOut('Must provide valid email.');
			if(iemail === ""){
				return errOut('Email cannot be empty');
			}
			callAJAX(rootSite + '/api/register?', {
				user: iuser,
				md5: ipassword,
				characterName: icharacter,
				server: iserver,
				email: iemail
			}, function (data, b, c) {
				if (data['success']) {
					$.modal.close();
					$('.modal').modal({onShow : function (dialog) {
						dialog.data.append(registerSuccessHtml);
					}});
					scaleModal(1);
				} else {
					scaleModal(2, 1);
					console.log(data);
					errOut('server: ' + data['err']);
				}
			});
		});
	},
	'Login': function () {
		hideSplash();
		scaleModal(1);
		showModal(loginHtml, function (event) {
			event.preventDefault();
			callAJAX(rootSite + '/api/login?', {
				'user': $('#loginUsername').val(),
				'md5': md5($('#loginPassword').val()),
			}, function (data, b, c) {
				//console.log(data);
				//data = JSON.parse(data);
				console.log(typeof data);
				$.modal.close()
				$('.modal').modal({
					onShow: function (dialog) {
						if (!(data['success'] == true)) {
							dialog.data.append(loginFailedHtml);
						} else {
							dialog.data.append(loginSuccessHtml);
							$('#loginSuccessUser').append(data['user']);
						}
					}
				});
			}, function (data) {
				console.log(data);
				//$('#AJAXResponse').append(JSON.parse(data)['success']);
			});
		});
	},
	'Logout': function () {
		hideSplash();
		scaleModal(0.5);
		showModal(logoutHtml, function (event) {
			event.preventDefault();
			callAJAX(rootSite + '/api/logout?', {}, function (data) {
				//console.log(data);
				//data = JSON.parse(data);
				$.modal.close()
				$('.modal').modal({
					onShow: function (dialog) {
						dialog.data.append(logoutSuccessHtml);
					}
				});
			}, function (data) {});
		});
	},
	'About' : function(){
	
	
	},
};
var loadlnav = function () {
	var lnav = $('.l-nav');
	lnav.append('<ul id="lnavLinkList"></ul>');
	lnav = $('#lnavLinkList');
	for (var a in lnavButtons) {
		//console.log('loading button: ' + a + " with function: " + lnavButtons[a]);
		lnav.append("<li class=lnavListElement><a href='#' id=" + removeSpaces(a) + ">" + a + "</a></li>");
		$("#" + removeSpaces(a)).click(lnavButtons[a]);
		$('#' + removeSpaces(a)).css('color', 'white');
		$('#' + removeSpaces(a)).trigger('create');
	};
	// lnav = $('.l-nav');
	//lnav.append('<div id="themeSelect">');
	// lnav.append('<select id="themeSelectMenu"></select>');
	// var themeSelect = $('#themeSelectMenu');
	// themes.forEach(function (a) {
		// if (a === 'none') return; //skip the none placeholde
		//onsole.log(a);
		// themeSelect.append('<option value=' + a + '>' + a + '</option>');
	// });
	// lnav.append('<button class=pure-button id="themeApply">Apply</button>');
	//lnav.append('</div>');
	// $('#themeApply').click(function (event) {
		// var themeSelected = $('#themeSelectMenu').val();
		// useTheme(themeSelected);
	// });
	// loadAbout($('.l-nav'));
	
}
$(window).load(function () {
	$('.ticker').marquee({
		gap: 50,
		delayBeforeStart: 0,
		direction: 'left',
		duplicated: true
	});
	$('.splash').click(function (event) {
		$('.splash').hide();
	});
	// setTimeout(10000, function(){ 
	// location.reload(true);
	// });
	useTheme(defaultTheme());
	loadlnav();
	setTimeout(showNewestListings, 5000);
});