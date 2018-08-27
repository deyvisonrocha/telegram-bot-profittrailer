const winston = require('winston')
const { format } = require('logform')
const { combine, timestamp, printf } = format

const myFormat = printf(info => {
  return `[${info.timestamp}] [${info.level}]: ${info.message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/info.log' }),
    new winston.transports.Console({ level: 'debug', handleExceptions: true, json: false, colorize: true })
  ]
})

module.exports = logger
