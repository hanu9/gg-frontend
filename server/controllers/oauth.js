'use strict';

var config = require('../config');
var request = require('request');
var traceLogger = require('../loggers').trace;
var cookieName = 'X-MW-TOKEN';


var oauthClient = {

	fetchToken: function(code, callBack){
		console.log('[fetchToken]: fetchToken token for code ', code);

		if (!code) {
			//TODO: Handle this
		}

		var options = {
			url: config.oauth.endpoint + '/oauth2/token',
			method: 'POST',
			form : {
				grant_type : "authorization_code",
				code : code,
				client_id: config.oauth.clientId,
				scope: config.oauth.scope
			},
			json: true,
			auth: {
				user: config.oauth.clientId,
				pass: config.oauth.clientSecret
			}
		}

		console.log('[fetchToken]: making request with', options);

		request(options, callBack);
	},

	fetchUserDetails: function(token, callBack){

		if (!token) {
			// TODO:
		}

		console.log('[fetchUserDetails] getting user details');

		var options = {
			url: config.oauth.endpoint + '/user/',
			method: 'GET',
			headers: {
				session_token: token
			},
			json: true
		};

		console.log('[fetchUserDetails]: making request with', options);

		request(options, callBack);


	}
};


var oauth = {
	getSessionInfo: function(req, res, next) {
		traceLogger.info(req,"[getSessionInfo]:: user session "+JSON.stringify(req.session.user));
		if (req.session && req.session.user) {
			var resp = req.session.user;
			delete resp.accessToken;
			res.send(resp);
		} else {
			var error = new Error('Unauthorized Access');
			error.status = 401;
			traceLogger.error(req,"[getSessionInfo]:: Unauthorized Access");
			return next(error);
		}
	},

	fetchToken: function(req, res, next){
		var code = req.query.code;
		var err;
		if (req.session && req.session.user &&  req.session.user.accessToken) {
			return next();
		}
		if (!code) {
			err = new Error('Empty code received!');
			err.status = 417;
			traceLogger.error(req,"[fetchToken]:: Empty code received!");
			return next(err);
		} else {
			oauthClient.fetchToken(code, processToken);
		}

		function processToken (error, response, body) {

			if (error || response.statusCode !== 200 || !body || !body.access_token) {

				if (!error) {
					traceLogger.error(req,"[processToken]:: No error object received");
				}

				if (response.statusCode !== 200) {
					traceLogger.error(req,"[processToken]:: Status code received is "+response.statusCode);
				}

				if(!body) {
					traceLogger.error(req,"[processToken]:: No body and access_token received");
				}

				if (body && !body.access_token) {
					traceLogger.error(req,"[processToken]:: No access_token in body received");
					traceLogger.error(req,"[processToken]:: Body contents are "+body);
				}
				traceLogger.error(req,"[processToken]:: Error in getting access_token");
				return next(error || new Error('Error in getting access_token'));
			}

			req.accessToken = body.access_token;
			traceLogger.info(req,"[processToken]:: Token received from oauth is "+req.accessToken);
			return next();
		}
	},

	fetUserDetails: function(req, res, next) {
		var accessToken = req.accessToken;
		if (req.session && req.session.user &&  req.session.user.accessToken) {
			return next();
		}
		if (!accessToken) {
			traceLogger.error(req,"[fetUserDetails]:: Empty access token received!");
			var error = new Error('Empty access token received!');
			error.status = 417;
			return next(error);
		}

		oauthClient.fetchUserDetails(accessToken, processUserDetails);

		function processUserDetails (err, response, userDetails) {
			if (err || response.statusCode !== 200 || !userDetails) {
				return next(err);
			}
			traceLogger.info(req,"[processUserDetails]:: User details are "+JSON.stringify(userDetails));

			if (req.session && !req.session.user) {
				req.session.user = {};
				req.session.user.firstName = userDetails.firstName;
				req.session.user.middleName = userDetails.middleName;
				req.session.user.lastName = userDetails.lastName;
				req.session.user.username = userDetails.username;
				req.session.user.mobile = userDetails.mobile;
				req.session.user.status = userDetails.status;
				req.session.user.custId = userDetails.id;
				req.session.user.email = userDetails.email || '';
				req.session.user.isEmailVerified = userDetails.is_verified_email;
				req.session.user.accessToken = accessToken;
				try{
				req.session.save(function(err) {
					traceLogger.error(req,"[processUserDetails]:: Redis error "+err);
					//console.log('session saved');
					return next();
				});
			}catch(e){
				traceLogger.error(req,"[processUserDetails]:: Redis error in catch section "+err);
			}
			}else if(req.session && req.session.user){
				req.session.user.accessToken = accessToken;
				return next();
			}
		}
	},

	logout: function (req, res) {
		var locals = {
			title: 'Merchant Signup',
			oauthUrl: config.oauth.endpoint,
			clientId: config.oauth.clientId,
			redirectUri: config.oauth.redirectURI,
			responseType: config.oauth.responseType,
			scope: config.oauth.scope,
			host: config.host,
			publicHost: config.publicHost
		};
		if (req.session && req.session.user) {
			req.session.destroy(function(err){
				res.clearCookie(cookieName,{ path: '/', domain : '.paytm.com'});
				//res.render('index', locals);
				res.end();
			});
		}else{
			res.end("logout");
		}
	},

	updateSession: function(req, res, next) {
		if (req.session && req.session.user) {
			var accessToken = req.session.user.accessToken;

			if (!accessToken) {
				traceLogger.error(req,"[updateSession]:: Empty access token received!");
				var error = new Error('Empty access token received!');
				error.status = 417;
				return next(error);
			}

			oauthClient.fetchUserDetails(accessToken, processUserDetails);

		} else {
			traceLogger.error(req,"[updateSession]:: You are not logged in!");
			var error = new Error('You are not logged in!');
			error.status = 403;
			return next(error);
		}

		function processUserDetails (err, response, userDetails) {
			if (err || response.statusCode !== 200 || !userDetails) {
				return next(err);
			}

			traceLogger.info(req,"[updateSession:processUserDetails]:: User details are "+JSON.stringify(userDetails));

			req.session.user = {};
			req.session.user.username = userDetails.username;
			req.session.user.mobile = userDetails.mobile;
			req.session.user.status = userDetails.status;
			req.session.user.custId = userDetails.id;
			req.session.user.email = userDetails.email || '';
			req.session.user.isEmailVerified = userDetails.is_verified_email;
			req.session.user.accessToken = accessToken;

			req.session.save(function(err) {
				traceLogger.error(req,"[updateSession:processUserDetails]:: Redis error "+err);
				//console.log('session saved');
				res.send('Session Updated');
			});
		}
	},

	createGoldengateSession: function (req, res, next) {
		traceLogger.info(req,"[createGoldengateSession]:: user session "+JSON.stringify(req.session.user));
		if (req.session && req.session.user) {
			var url = config.goldenGate.endpoint + '/MerchantService/v1/token';
			var type = 'POST';
			var accessToken = req.session.user.accessToken;
			var ipAddress;
			var clientIPAddress;

			if (!accessToken) {
				traceLogger.error(req,"[createGoldengateSession]:: Empty access token received!");
				var error = new Error('Empty access token received!');
				error.status = 417;
				return next(error);
			}

			ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			ipAddress = ipAddress.split(',');
			clientIPAddress = ipAddress[0];
			var data = {
				oAuthToken: accessToken,
				ipAddress: clientIPAddress
			};

			var options = {
				method: type,
				url: url,
				body: data,
				json: true
			};
			traceLogger.info(req,"[createGoldengateSession]:: Authorizing with "+JSON.stringify(options));
			return request(options, onPostAuthorize);

		} else {
			var error = new Error('Unauthorized Access');
			error.status = 401;
			traceLogger.error(req,"[createGoldengateSession]::Unauthorized Access");
			return next(error);
		}

		function onPostAuthorize(error, response, data) {
			traceLogger.error(req,"[createGoldengateSession:onPostAuthorize]:: error: "+error);
			if (error || response.statusCode !== 204) {
				return req.session.destroy(function(err) {
					traceLogger.error(req,"[createGoldengateSession:onPostAuthorize]::Unauthorized Access "+JSON.stringify(response));
					var error = new Error('Unauthorized Access');
					error.status = 401;
					return next(error);
				});
			}

			var cookieData = response.headers['set-cookie'];

			if (cookieData && cookieData.length) {
				var cookieValue = cookieData[0].split(cookieName + '=')[1];
				traceLogger.info(req,"[createGoldengateSession:onPostAuthorize]:: Cookie Name "+cookieName+" Cookie Value "+cookieValue);

				var host = config.host;
				var domain = '.paytm.in';

				if (host.indexOf('paytm.com') > -1) {
					domain = '.paytm.com';
				}

				res.cookie(cookieName, cookieValue, {
	                domain: domain,
	                // path: '/',
	                httpOnly: true
				});

				traceLogger.info(req, 'res cookie: ' + JSON.stringify(res.cookie) +' domain: '+domain +' config host: '+host);
				var locals = {
					title: 'Merchant Signup',
					oauthUrl: config.oauth.endpoint,
					clientId: config.oauth.clientId,
					redirectUri: config.oauth.redirectURI,
					responseType: config.oauth.responseType,
					scope: config.oauth.scope,
					host: config.host,
					publicHost: config.publicHost,
					solution: req.params.solution
				};
				traceLogger.info(req,"[createGoldengateSession:onPostAuthorize]:: Locals "+JSON.stringify(locals));
				res.render('redirect',locals);
			} else {
				req.session.destroy(function(err) {
					traceLogger.error(req,"[createGoldengateSession:onPostAuthorize]:: No cookie received");
					var error = new Error('No cookie received');
					error.status = 401;
					return next(error);
				});
			}
		}
	},

	deleteGoldengateSession: function (req, res, next) {
		if (req.session && req.session.user) {

			var cookie = cookieName + '=' + encodeURIComponent(req.cookies[cookieName]);
			var url = config.goldenGate.endpoint + '/MerchantService/v1/token';
			var type = 'DELETE';

			var options = {
				method: type,
				url: url,
				headers: {
					cookie: cookie
				}
			};
			traceLogger.info(req,"[deleteGoldengateSession]:: deleting session at golden gate "+options.url);

			request(options, onLogout);
		} else {
			// var locals = {
			// 	title: 'Merchant Signup',
			// 	oauthUrl: config.oauth.endpoint,
			// 	clientId: config.oauth.clientId,
			// 	redirectUri: config.oauth.redirectURI,
			// 	responseType: config.oauth.responseType,
			// 	scope: config.oauth.scope,
			// 	host: config.host,
			// 	publicHost: config.publicHost
			// }
			// res.render('login', locals);
			res.end();
		}

		function onLogout(error, response, data) {
			if (error || (response.statusCode !== 204  && response.statusCode !== 404)) {
				traceLogger.info(req,"[deleteGoldengateSession:onLogout]:: Unable to delete session at golden gate");
				var error = new Error('Unable to delete session at golden gate');
				error.status = 403;
				return next(error);
			} else {
				return next();
			}
		}
	},

	getServices: function (req, res, next) {
		// if (req.session && req.session.user) {
			res.send({
				goldenGate: config.goldenGate.endpoint,
				host: config.host,
				publicHost: config.publicHost,
				wallet: config.walletEndpoint,
				cart: config.cart,
				oauth: {
					endPoint: config.oauth.endpoint,
					clientId: config.oauth.clientId
				},
				embedCode: config.embedCode.baseUrl
			});

		// } else {
		// 	var error = new Error('Unauthorized Access');
		// 	error.status = 401;
		// 	return next(error);
		// }
	},

	solution: function(req, res, next, name){
		var locals = {
			config,
			assetsConfig,
			chunkManifest,
			solution: "",
			loggedin: false
		};

		if (req.session && req.session.user) {
			locals.solution = name;
			locals.loggedin = true;
		}
		res.render('index', locals);
	}
};

module.exports = oauth;
