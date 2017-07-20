var winston = require('winston');
var config = require('../config');
require('winston-daily-rotate-file');

var ret = {};

const tsFormat = () => (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

var transport = new winston.transports.DailyRotateFile({
   filename: config.loggerPath + '/api.log',
   datePattern: 'yyyy-MM-dd.',
   prepend: true,
   timestamp: tsFormat,
   colorize: true
});

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({timestamp: tsFormat}),
      transport
    ]
  });

ret.info = function(req, str){
	logger.info(req.id+' : '+str);
}

ret.debug = function(req, str){
	logger.debug(req.id + ' : ' + str);
}

ret.error = function(req, str){
	logger.error(req.id + ' : '+ str);
}

module.exports = ret;
