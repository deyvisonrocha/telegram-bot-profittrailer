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
    var reply = '*Saldos:* \n'
    reply += response.data.realBalance.toFixed(8) + ' ' + response.data.market + ' # Disponível para Trade\n\n'
    reply += '*Totais:*\n'
    reply += bnbBalance + ' BNB\n'
    reply += balance.toFixed(8) + ' ' + response.data.market + '\n\n'
    reply += '*Resultados:*\n'
    reply += 'Hoje: ' + response.data.stats.totalProfitPercToday + '% (' + response.data.stats.totalSalesToday + ' trades)\n'
    reply += 'Ontem: ' + response.data.stats.totalProfitPercYesterday + '% (' + response.data.stats.totalSalesYesterday + ' trades)\n'
    reply += 'Esta semana: ' + response.data.stats.totalProfitPercWeek + '% (' + response.data.stats.totalSalesWeek + ' trades)\n'
    return reply
  })
  .then(reply => {
    ctx.reply(reply, { parse_mode: 'markdown' })
    logger.info('comando /saldo respondido.')
  })
  .catch(err => {
    ctx.reply('Ops... Algo errado. ' + err)
    logger.error('Ops... Algo errado: ' + err)
  })
})
