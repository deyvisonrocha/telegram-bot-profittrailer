/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../services/telegram'),
  logger = require('../services/logger'),
  axios = require('axios')

bot.command('saldo', (ctx) => {
  logger.info('Pegando informações gerais')
  let dailyPercent,
    dailyProfit,
    dailyProfitFiat,
    dailyProfitCount,
    yesterdayPercent,
    yesterdayProfit,
    yesterdayProfitFiat,
    yesterdayProfitCount,
    monthlyProfit,
    monthlyCount,
    tcv,
    bnbAmount,
    totalAmount = 0,
    reply

  const URL_MONHTY = 'http://bit.deyvisonrocha.com:3000/api/monthly-sales.json',
    URL_DAILY = 'http://bit.deyvisonrocha.com:3000/api/daily-sales.json',
    URL_TCV = 'http://bit.deyvisonrocha.com:3000/api/tcv.json',
    URL_PAIRS = 'http://bit.deyvisonrocha.com:3000/api/pairs.json',
    URL_CONFIGURATION = 'http://bit.deyvisonrocha.com:3000/api/configuration.json'

  axios.all([
    axios.get(URL_MONHTY),
    axios.get(URL_DAILY),
    axios.get(URL_TCV),
    axios.get(URL_PAIRS),
    axios.get(URL_CONFIGURATION)
  ])
    .then(axios.spread((responseMonthly, responseDaily, responseTcv, responsePairs, responseConfig) => {
      let now = new Date(),
        monthlyFormat = now.getFullYear() + '-' + (now.getMonth() + 1),
        dailyFormat = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
        yesterdayFormat = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate() - 1)

      responseMonthly.data.map(item => {
        if (monthlyFormat === item.sold_month) {
          monthlyCount = item.sell_count
          monthlyProfit = item.profit.toFixed(2)
        }
      })

      responseDaily.data.map(item => {
        if (dailyFormat === item.sold_date) {
          dailyPercent = item.profit_percent.toFixed(2)
          dailyProfit = item.profit.toFixed(8)
          dailyProfitFiat = item.profit_fiat
          dailyProfitCount = item.sell_count
        }
        if (yesterdayFormat === item.sold_date) {
          yesterdayPercent = item.profit_percent.toFixed(2)
          yesterdayProfit = item.profit.toFixed(8)
          yesterdayProfitFiat = item.profit_fiat
          yesterdayProfitCount = item.sell_count
        }
      })

      responseTcv.data.map(item => {
        if (item.key === 'realBalance') {
          tcv = parseFloat(item.value).toFixed(8)
        }

        if (parseFloat(item.value) > 0) {
          totalAmount += parseFloat(item.value)
        }
      })

      responsePairs.data.map(item => {
        if (item.market === 'BNBETH') {
          bnbAmount = item.total_amount.toFixed(8)
        }
      })

      reply = '*Saldo para Trade:*\n' + tcv + ' ' + responseConfig.data.market + '\n\n'
      reply += '*Totais:*\n'
      reply += bnbAmount + ' BNB\n'
      reply += totalAmount.toFixed(8) + ' ' + responseConfig.data.market + '\n\n'
      reply += '*Resultados:*\n'
      reply += '*Hoje*: \n'
      reply += ' - ' + dailyPercent + '%\n'
      reply += ' - ' + dailyProfitCount + ' trades\n'
      reply += ' - ' + dailyProfitFiat + ' USD\n'
      reply += ' - ' + dailyProfit + ' ETH\n'
      reply += '*Ontem*: \n'
      reply += ' - ' + yesterdayPercent + '%\n'
      reply += ' - ' + yesterdayProfitCount + ' trades\n'
      reply += ' - ' + yesterdayProfitFiat + ' USD\n'
      reply += ' - ' + yesterdayProfit + ' ETH\n'
      reply += '*Meses*: ' + monthlyProfit + ' ' + responseConfig.data.market + ' (' + monthlyCount + ' trades)'
      reply += '\n\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')'

      ctx.reply(reply, { parse_mode: 'markdown' })
    }))
    .catch(err => {
      ctx.reply('Ops... Algo errado. ' + err)
      logger.error('Ops... Algo errado: ' + err)
    })
})
