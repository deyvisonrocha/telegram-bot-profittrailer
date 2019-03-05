/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../services/telegram'),
  logger = require('../services/logger'),
  axios = require('axios')

bot.command('bags', (ctx) => {
  logger.info('Pegando informações DCAs')
  const URL_DCA = process.env.PTTRACKER_HOST + 'dca.json'
  axios.get(URL_DCA)
    .then(response => {
      let ordered = response.data
      ordered.sort((a, b) => {
        return b.profit - a.profit
      })

      let reply = '*Bags:* \n```\n'
      reply += 'Moeda | Profit % | Entradas \n'
      reply += '----- | -------- | -------- \n'
      ordered.map(dado => {
        let sellStrategy = JSON.parse(dado.sell_strategy)[0]
        reply += dado.market.slice(0, -3).leftJustify(5, ' ') + ' | ' + sellStrategy.currentValue.toFixed(2).toString().leftJustify(8, ' ') + ' | ' + dado.bought_times.toString().leftJustify(8, ' ') + '\n'
      })

      reply += '```'
      reply += '\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')'

      ctx.reply(reply, { parse_mode: 'markdown' })
      logger.info('comando /bags respondido.')
    })
    .catch(err => {
      ctx.reply('Ops... Algo errado. ' + err)
      logger.error('Ops... Algo errado: ' + err)
    })
})
