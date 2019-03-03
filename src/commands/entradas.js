/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../services/telegram'),
  logger = require('../services/logger'),
  axios = require('axios')

bot.command('entradas', (ctx) => {
  logger.info('Pegando informações Possible Buys')
  const URL_POSSIBLE_BUYS = process.env.PTTRACKER_HOST + 'possible-buys.json'
  axios.get(URL_POSSIBLE_BUYS)
    .then(response => {
      let ordered = response.data
      ordered.sort((a, b) => {
        return b.perc_change - a.perc_change
      })
      let reply = '*Entradas:* \n```\n'
      reply += '  Moeda | Estratégia (Entrada/Atual) \n'
      reply += '------- | -------------------------- \n'
      ordered.map(dado => {
        let estrategias = JSON.parse(dado.buy_strategy)
        reply += dado.market.slice(0, -3).leftJustify(7, ' ') + ' | '
        // reply += parseFloat((dado.perc_change * 100) * -1).toFixed(2).leftJustify(11, ' ') + ' | '
        let count = 0
        estrategias.map(item => {
          if (estrategias.length > 1) {
            if (count > 0) {
              reply += ' '
            }
            reply += item.name + ' ' + (item.positive === true ? '✔' : '❌')
            count++
          } else {
            reply += item.name + ' ' + (item.positive === true ? '✔' : '❌')
          }
        })
        reply += '\n'
      })
      reply += '```'
      reply += '\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')'
      ctx.reply(reply, { parse_mode: 'markdown' })
      logger.info('comando /entradas respondido.')
    })
    .catch(err => {
      ctx.reply('Ops... Algo errado. ' + err)
      logger.error('Ops... Algo errado: ' + err)
    })
})
