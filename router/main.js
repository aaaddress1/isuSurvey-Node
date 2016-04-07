// require Modules
var isu 	= require('../lib/isu/isu');
var survey 	= require('../lib/isu/survey');
var express = require('express');
var session = require('express-session');
var router 	= express.Router();

// Routers
router.route('/')
	.get(function(req, res){
		res.render('login.jade', { 

		});
	});

router.route('/login')
	.post(function(req, res){

		isu.login( req.body.usrId, req.body.usrPass, req, function(callback){
			if (callback.userName) {
				res.render('mainPage.jade', { 
					usrName: callback.userName[1], 
					list: callback.list
				});				
			}
			else {
				res.render('login.jade', { 
					errorMsg: '登入失敗, 帳號密碼不正確?'
				});
			}
		});
	});

router.route('/surveySend')
	.post(function(req, res){
		survey.sendSurvey( req.body.classId, req.body.cmd, req, function(sendSurveyRes) {

			if ( sendSurveyRes.indexOf('您可填寫的課程意見評量表') > -1 ) {

				isu.displayAll( req.body.userName, req, function(cb){
					res.render('mainPage.jade', { 
						usrName: cb.userName, 
						list: cb.list,
						NewMessage: req.body.className + ' 填寫成功!'
					});
				});

			}else{
				isu.displayAll( req.body.userName, req , function(cb){
					res.render('mainPage.jade', { 
						usrName: cb.userName, 
						list: cb.list,
						NewMessage: req.body.className + ' 填寫失敗O_Q...'
					});
				});
			}

		});
	});
// export module
module.exports = router;