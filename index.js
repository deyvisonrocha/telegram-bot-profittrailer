require('dotenv').config()
const winston = require('winston')
const Telegraf = require('telegraf')
const axios = require('axios')
const config = require('./config')
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

const bot = new Telegraf(config.telegram.key)

bot.command('saldo', (ctx) => {
  logger.info('Pegando informações em: http://bit.deyvisonrocha.com/api/data?token=' + config.pt.token)
  axios.get('http://bit.deyvisonrocha.com/api/data?token=' + config.pt.token)
  .then(r => {
    var balance = totalBalance(r.data)
    var bnbBalance = totalBinanceCoin(r.data)
    var reply = '<b>' + r.data.sitename + '</b> v2\n\n'
    reply += '<b>Saldos:</b>\n'
    reply += balance + ' ' + r.data.market + '\n'
    reply += bnbBalance + ' BNB\n\n'
    reply += '<b>Resultados:</b>\n'
    reply += 'Hoje: ' + r.data.stats.totalProfitPercToday + '% (' + r.data.stats.totalSalesToday + ' trades)\n'
    reply += 'Ontem: ' + r.data.stats.totalProfitPercYesterday + '% (' + r.data.stats.totalSalesYesterday + ' trades)\n'
    reply += 'Esta semana: ' + r.data.stats.totalProfitPercWeek + '% (' + r.data.stats.totalSalesWeek + ' trades)\n'

    ctx.reply(reply, { parse_mode: 'HTML' })
    logger.info('comando /saldo respondido.')
  })
  .catch(err => {
    ctx.reply('Ops... Algo errado. ' + err)
    logger.error('Ops... Algo errado: ' + err)
  })
})

function totalBalance(resultApi) {
  return parseFloat(resultApi.realBalance) + parseFloat(resultApi.totalDCACurrentValue) + parseFloat(resultApi.totalPairsCurrentValue) + parseFloat(resultApi.totalPendingCurrentValue) + parseFloat(resultApi.totalDustCurrentValue)
}
function totalBinanceCoin(resultApi) {
  return parseFloat(resultApi.watchModeLogData[0].averageCalculator.totalAmount)
}

bot.startPolling()
logger.info('Telegram polling')
