'use strict';

var winston = require('winston');

var _require = require('logform'),
    format = _require.format;

var combine = format.combine,
    timestamp = format.timestamp,
    printf = format.printf;

var myFormat = printf(function (info) {
  return '[' + info.timestamp + '] [' + info.level + ']: ' + info.message;
});

var logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  transports: [new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), new winston.transports.File({ filename: 'logs/info.log' }), new winston.transports.Console({ level: 'debug', handleExceptions: true, json: false, colorize: true })]
});

module.exports = logger;