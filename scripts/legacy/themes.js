var themeMappings = {
	'modal': 3,
	'header': 2,
	'view': 1,
	'footer': 2,
	'l-nav': 0,
	'table.resultsTable' : 2,
};
var getClassName = function (theme, mapping, background) {
	if (!background) {
		return theme + "-primary-" + mapping;
	}
	return theme + "-primary-" + mapping + "b";
};
var themes = ['none', 'sand', 'ocean'];
var defaultTheme = function () {
	return 'ocean';
}
var getClassesInTheme = function (theme) {
	if (theme === 'none') return [];
	var ret = [];
	var keys = Object.keys(themeMappings);
	for (var x = 0; x < keys.length; x++) {
		ret.push(getClassName(theme, themeMappings[keys[x]], true));
		ret.push(getClassName(theme, themeMappings[keys[x]]));
	}
	return ret;
}
var resetThemes = function (toDefault) {
	for (var x = 0; x < themes.length; x++) {
		getClassesInTheme(themes[x]).forEach(function (a) {
			//console.log(a);
			$('div.modal').removeClass(a);
			$('div.header').removeClass(a);
			$('div.footer').removeClass(a);
			$('div.l-nav').removeClass(a);
			$('div.view').removeClass(a);
		});
	}
	if (toDefault) useTheme(defaultTheme());
}
var getThemeByClassName = function (className) {
	if (className.indexOf('-') < 0) {
		return ""; //if there aren't any - separators, assume no theme is set.
	}
	var tmp = className.split('-');
	if (themes.indexOf(tmp[0]) < 0) {
		return "";
	}
	return themes[themes.indexOf(tmp[0])];
};
var getThemeFromAllClasses = function (classes) {
	var tmp = classes.split(' ');
	var theme = "";
	for (var x = 0; x < tmp.length; x++) {
		var a = getThemeByClassName(tmp[x]);
		if (a != "") {
			if (theme != "") {
				return -1;
			}
			theme = a;
		}
	}
	return theme;
}
var curTheme = defaultTheme();
var useTheme = function (themeName) {
	if (themeName === 'none') {
		return useTheme(defaultTheme());
	}
	if (themes.indexOf(themeName) < 0) {
		return; //fail silently
	}
	resetThemes(false);
	$('div.modal').addClass(getClassName(themeName, 3, true));
	$('div.header').addClass(getClassName(themeName, 2, true));
	$('div.view').addClass(getClassName(themeName, 1, true));
	$('div.footer').addClass(getClassName(themeName, 2, true));
	$('div.l-nav').addClass(getClassName(themeName, 0, true));
	($('table.resultsTable') != undefined) ? $('table.resultsTable').addClass(getClassName(themeName, 2, true)) : console.log('no table to style');
	curTheme = themeName;
	return;
};