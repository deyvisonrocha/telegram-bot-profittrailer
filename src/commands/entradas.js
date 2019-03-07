/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../services/telegram'),
  logger = require('../services/logger'),
  axios = require('axios'),
  { marketColumn, marketRows } = require('./../functions/utils')

const avaliableStrategies = [
  'SIGNAL',
  'LOWBB',
  'HIGHBB',
  'GAIN',
  'LOSS',
  'SMAGAIN',
  'EMAGAIN',
  'HMAGAIN',
  'DEMAGAIN',
  'SMASPREAD',
  'EMASPREAD',
  'HMASPREAD',
  'DEMASPREAD',
  'SMACROSS',
  'EMACROSS',
  'HMACROSS',
  'DEMACROSS',
  'RSI',
  'STOCH',
  'STOCHRSI',
  'STOCHRSID',
  'STOCHRSIK',
  'STOCHRSICROSS',
  'MACD',
  'BBWIDTH',
  'OBV',
  'PDHIGH',
  'ANDERSON',
  'DISABLED',
]

function checkAndAdd(arr, item) {
  var found = arr.some(function (el) {
    return el.name === item.name
  })
  if (!found) { arr.push({ name: item.name, entryValue: item.entryValue, entryValueLimit: item.entryValueLimit }) }
}

bot.command('entradas', (ctx) => {
  logger.info('Pegando informações Possible Buys')
  const URL_POSSIBLE_BUYS = process.env.PTTRACKER_HOST + 'possible-buys.json'
  axios.get(URL_POSSIBLE_BUYS)
    .then(response => {
      let ordered = response.data
      let legenda = []
      ordered.sort((a, b) => {
        return a.perc_change - b.perc_change
      })
      let reply = '*Entradas:* \n```\n'
      reply += marketColumn() + ' | Estratégias \n'
      reply += '------- | ----------------------- \n'
      ordered.map(dado => {
        let estrategias = JSON.parse(dado.buy_strategy)
        reply += marketRows(dado.market)
        estrategias.map(item => {
          if (avaliableStrategies.indexOf(item.name) > -1) {
            checkAndAdd(legenda, item)
            reply += item.currentValue.toFixed(2).toString() + ' ' + (item.positive === 'true' ? '✅' : '❌') + ' '
          }
        })
        reply += '\n'
      })
      reply += '\n'
      legenda.map(dado => {
        reply += `${dado.name}: ${dado.entryValue} (Limite: ${dado.entryValueLimit})\n`
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
