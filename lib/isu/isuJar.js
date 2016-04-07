var request = require('request');
var session = require('express-session');

var getJar = function(req) {

	var jar = request.jar();

	if (req && req.session.loginedJar) {
		console.log(req.session.loginedJar);
		req.session.loginedJar.split(";").map(function (val) { 
			jar.setCookie( request.cookie(val), 'http://netreg.isu.edu.tw' );			
		});
	}


	return jar;
}

var getJarByJarStr = function(str) {

	var j = request.jar();

	str.split(";").map(function (val) { 
		j.setCookie( request.cookie(val), 'http://netreg.isu.edu.tw' );			
	});

	return j;
}

module.exports.getJar 		= getJar;
module.exports.getJarByJarStr 		= getJarByJarStr;