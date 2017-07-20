var loggers = {};
loggers.trace = require('./traceLogger');
loggers.api = require('./apiLogger');
loggers.rr = require('./rrLogger');

module.exports = loggers;	