// require Modules
var request = require('request');
var iconv 	= require('iconv-lite');
var isuJar = require('./isuJar');

//var session = require('express-session');


var getSurveyBody = function( classCode, cmdCode, req, callback ) {
	request({
			url: 'http://netreg.isu.edu.tw/wapp/wap_13/wap_130100.asp',
			method: 'POST',
			encoding: null,
			followAllRedirects: true,
			jar: isuJar.getJar(req),
			headers: {
				referer: 'http://netreg.isu.edu.tw/wapp/wap_13/wap_130100.asp'
			},
			form: {
				crcode: classCode, 
				command: cmdCode,
				submit1: '%AD%D7%A7%EF%B0%DD%A8%F7',
				surtype: 0
			}
		}, function (e, r, b) {

			var body = iconv.decode(b, 'Big5');
			
			callback(body);
		});
}

var pattenRadio = /name=\x22([^\x22]+)\x22 type=radio value=\x22([^\x22]+)\x22>非常同意/g
var pattenInput = /name=\x22([^\x22]+)\x22 type=input value=\x22(.*?)\x22/g
var pattenHiden = /name=([^ ]+) type=hidden value=\x22(.*?)\x22/g

var sendSurvey = function( classCode, cmdCode, req, callback) {

	getSurveyBody( classCode, cmdCode, req, function(surveyBody) {
		var param = {};
		param['cr_code'] = classCode;
		param['X01X06M1/Y'] = 'Y';
		param['X01X04M1/Y'] = 'Y';
		param['X08X10M1/Y'] = 'Y';
		param['submit1'] = '%B6%F1%A6n%B0e%A5X';

		//到今天為止，我預期本學期本門課的成績可能是
		param['X01X03/Y'] = 'L2';
		//勾取本學期中我有的正式記錄。（可複選）
		param['X01X07M6/Y'] = 'Y';

		//老師對學生沒有性別歧視的表現
		param['X08X05/Y'] = 'L1';
		//老師對學生沒有不當的肢體接觸。
		param['X08X06/Y'] = 'L1';
		//老師與學生維持恰當的性平態度
		param['X08X07/Y'] = 'L1';
		//老師不因性別差異而有不當的學習安排。
		param['X08X08/Y'] = 'L1';
		do {
			m = pattenRadio.exec(surveyBody);
			if (m) param[ m[1] ] = m[2];
		} while (m);
		do {
			m = pattenInput.exec(surveyBody);
			if (m) param[ m[1] ] = m[2];
		} while (m);
		do {
			m = pattenHiden.exec(surveyBody);
			if (m) param[ m[1] ] = m[2];
		} while (m);
		//console.log( param );
	request({
			url: 'http://netreg.isu.edu.tw/wapp/wap_13/wap_130100.asp',
			method: 'POST',
			encoding: null,
			followAllRedirects: true,
			jar: isuJar.getJar(req),
			headers: {
				referer: 'http://netreg.isu.edu.tw/wapp/wap_13/wap_130100.asp'
			},
			form: param
		}, function (e, r, b) {
			var body = iconv.decode(b, 'Big5');
			callback(body);
		});
	});
} 


// export modules
module.exports.sendSurvey 		= sendSurvey;