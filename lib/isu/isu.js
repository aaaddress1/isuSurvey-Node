// require Modules
var tough = require('tough-cookie');
var request = require('request');
var iconv 	= require('iconv-lite');
var session = require('express-session');
var isuJar = require('./isuJar');

var displayAll = function(usrName, req, callback) {

	request({
		url: 'http://netreg.isu.edu.tw/wapp/wap_13/wap_130100.asp',
		method: 'GET',
		encoding: null,
		jar: isuJar.getJar(req)
	}, function(e, r, b) {
		var body = iconv.decode(b, 'Big5');
		body = body.replace(/\x09/g,'').replace(/\r\n/g,'');
		
		var patten = /<td><INPUT id=crcode[^>]+>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><INPUT id=surtype name=surtype.{33}command.{0,100}value=\x22([^\x22]+)\x22/g;

		var classNameAll = [];
		var currPos = 0;
		do {
			m = patten.exec(body);
			if (m) classNameAll[currPos++] =	[ 
													m[1],
													m[2].replace('&nbsp;',''),
													m[3].replace('&nbsp;',''),
													m[4].replace('&nbsp;',''),
													m[5]
												];
		} while (m);

		// console.log( classNameAll );
		if(callback){
			callback({
				userName	: usrName,
				list 		: classNameAll
			});
		}
	});
};

var login = function( usr, pass, req, callback) {
	var j = isuJar.getJar(req);
	request({
			url: 'http://netreg.isu.edu.tw/Wapp/wap_check.asp',
			method: 'POST',
			encoding: null,
			followAllRedirects: true,
			jar: j,
			headers: {
				referer: 'http://netreg.isu.edu.tw/Wapp/wap_indexmain.asp?call_from=logout'
			},
			form: {
				logon_id: usr, 
				txtpasswd: pass
			}
		}, function (e, r, b) {

				request.get({
							url: 'http://netreg.isu.edu.tw/Wapp/left.asp',
							encoding: null,
							jar: j,
						}, 	function(ee ,rr ,bb)
							{

								var body = iconv.decode(bb, 'Big5');
								//console.log(body);
								var usrName = body.match(/登出<\/font>.*?<span[^>]+>([^<]+)<\/span>/);
								var loginedJar = j.getCookieString('http://netreg.isu.edu.tw');
								req.session.loginedJar = loginedJar;

								displayAll( usrName, req,function(cb){
									callback(cb);
								});
							}
						);
		});
} 


// export modules
module.exports.login 		= login;
module.exports.displayAll 	= displayAll;