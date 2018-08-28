const bot = require('../services/telegram')
const logger = require('../services/logger')
const axios = require('axios')
const ptConfig = require('../config/pt')

bot.command('bags', (ctx) => {
  logger.info('Pegando informações DCAs')
  axios.get('http://bit.deyvisonrocha.com/api/dca/log?token=' + ptConfig.token)
  .then(r => {
    var dados = r.data.map(item => {
      var dado = {}
      dado.currency = item.currency
      dado.profit = item.sellStrategies.currentValue
      dado.boughtTimes = item.boughtTimes

      return dado
    })

    var ordered = dados.slice(0);
    ordered.sort(function(a,b) {
        return b.profit - a.profit;
    });

    var reply = '**PTROCHA** v2\n\n'

    reply += '**Bags:**\n```\n'

    ordered.map(dado => {
      reply += dado.currency.padEnd(7)
      if (dado.boughtTimes > 0) {
        reply += ' (' + dado.boughtTimes + ') '
      } else {
        reply += '     '
      }
      reply += dado.profit.toFixed(2) + '%\n'
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
