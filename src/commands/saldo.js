const bot = require('../services/telegram')
const logger = require('../services/logger')
const axios = require('axios')
const ptConfig = require('../config/pt')
const { totalBalance, totalBinanceCoin } = require('../functions/utils')

bot.command('saldo', (ctx) => {
  logger.info('Pegando informações em: http://bit.deyvisonrocha.com/api/data?token=' + ptConfig.token)
  axios.get('http://bit.deyvisonrocha.com/api/data?token=' + ptConfig.token)
  .then(r => {
    var balance = totalBalance(r.data)
    var bnbBalance = totalBinanceCoin(r.data)
    var reply = '<b>PTROCHA</b> v2\n\n'
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
