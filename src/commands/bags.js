const bot = require('../services/telegram')
const logger = require('../services/logger')
const { http } = require('../services/axios')

bot.command('bags', (ctx) => {
  logger.info('Pegando informações DCAs')
  http.get('api/dca/log')
  .then(r => {
    var dados = r.data.map(item => {
      var dado = item
      dado.profit = item.profit
      dado.currency = item.currency
      dado.boughtTimes = item.boughtTimes
      dado.percent = item.sellStrategies[0].currentValue
      return dado
    })

    var ordered = dados.slice(0);
    ordered.sort(function(a,b) {
        return b.profit - a.profit
    })

    var reply = '*Bags:*\n```\n'

    ordered.map(dado => {
      reply += dado.currency.padEnd(7)
      if (dado.boughtTimes > 0) {
        reply += ' (' + dado.boughtTimes + ') '
      } else {
        reply += '     '
      }
      reply += dado.percent.toFixed(2) + '%\n'
    })
    // return reply
    reply += '```'

    ctx.reply(reply, { parse_mode: 'markdown' })

    logger.info('comando /bags respondido.')
  })
  .catch(err => {
    ctx.reply('Ops... Algo errado. ' + err)
    logger.error('Ops... Algo errado: ' + err)
  })
})
