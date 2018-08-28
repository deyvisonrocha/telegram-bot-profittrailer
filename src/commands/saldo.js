const bot = require('../services/telegram')
const logger = require('../services/logger')
const { http } = require('../services/axios')
const { totalBalance, totalBinanceCoin } = require('../functions/utils')

bot.command('saldo', (ctx) => {
  logger.info('Pegando informações gerais')
  http.get('api/data')
  .then(response => {
    var balance = totalBalance(response.data)
    var bnbBalance = totalBinanceCoin(response.data)
    var reply = '<b>Saldos:</b>\n'
    reply += balance.toFixed(8) + ' ' + response.data.market + '\n'
    reply += bnbBalance + ' BNB\n\n'
    reply += '<b>Resultados:</b>\n'
    reply += 'Hoje: ' + response.data.stats.totalProfitPercToday + '% (' + response.data.stats.totalSalesToday + ' trades)\n'
    reply += 'Ontem: ' + response.data.stats.totalProfitPercYesterday + '% (' + response.data.stats.totalSalesYesterday + ' trades)\n'
    reply += 'Esta semana: ' + response.data.stats.totalProfitPercWeek + '% (' + response.data.stats.totalSalesWeek + ' trades)\n'
    return reply
  })
  .then(reply => {
    ctx.reply(reply, { parse_mode: 'HTML' })
    logger.info('comando /saldo respondido.')
  })
  .catch(err => {
    ctx.reply('Ops... Algo errado. ' + err)
    logger.error('Ops... Algo errado: ' + err)
  })
})
