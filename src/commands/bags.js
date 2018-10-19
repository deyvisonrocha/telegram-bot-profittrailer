/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../services/telegram'),
  logger = require('../services/logger'),
  { http } = require('../services/axios')

bot.command('bags', (ctx) => {
  logger.info('Pegando informações DCAs')
  http.get('api/dca/log')
    .then(r => {
      let dados,
        ordered,
        reply,
        count

      dados = r.data.map(item => {
        let dado = item
        dado.profit = item.profit
        dado.currency = item.currency
        dado.boughtTimes = item.boughtTimes
        dado.percent = item.sellStrategies[0].currentValue
        return dado
      })

      ordered = dados.slice(0)
      ordered.sort((a, b) => {
        return b.profit - a.profit
      })

      reply = '*Bags:* \n```\n'
      count = 1

      ordered.map(dado => {
        reply += count + '. ' + dado.currency.padEnd(7)
        if (dado.boughtTimes > 0) {
          reply += ' (' + dado.boughtTimes + ') '
        } else {
          reply += '     '
        }
        reply += dado.percent.toFixed(2) + '%\n'
        count++
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
