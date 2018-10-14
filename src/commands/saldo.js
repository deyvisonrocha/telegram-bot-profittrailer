const bot = require('../services/telegram')
const logger = require('../services/logger')
const axios = require('axios')

bot.command('saldo', (ctx) => {
  logger.info('Pegando informações gerais')
  let dailyPercent,
    dailyProfit,
    dailyProfitFiat,
    dailyProfitCount = 0
  let yesterdayPercent,
    yesterdayProfit,
    yesterdayProfitFiat,
    yesterdayProfitCount = 0
  let monthlyProfit, monthlyCount, tcv, bnbAmount = 0
  let totalAmount = new Number(0);

  const URL_MONHTY = 'http://bit.deyvisonrocha.com:3000/api/monthly-sales.json'
  const URL_DAILY = 'http://bit.deyvisonrocha.com:3000/api/daily-sales.json'
  const URL_TCV = 'http://bit.deyvisonrocha.com:3000/api/tcv.json'
  const URL_PAIRS = 'http://bit.deyvisonrocha.com:3000/api/pairs.json'
  const URL_CONFIGURATION = 'http://bit.deyvisonrocha.com:3000/api/configuration.json'

  axios.all([
    axios.get(URL_MONHTY),
    axios.get(URL_DAILY),
    axios.get(URL_TCV),
    axios.get(URL_PAIRS),
    axios.get(URL_CONFIGURATION),
  ])
  .then(axios.spread((responseMonthly, responseDaily, responseTcv, responsePairs, responseConfig) => {
    let now = new Date()
    let monthlyFormat = now.getFullYear() + '-' + (now.getMonth() + 1)
    responseMonthly.data.map(item => {
      if (monthlyFormat === item.sold_month) {
        monthlyCount = item.sell_count
        monthlyProfit = item.profit.toFixed(2)
      }
    })

    let dailyFormat = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    let yesterdayFormat = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate() - 1)
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
      if (item.key == 'realBalance') {
        tcv = parseFloat(item.value).toFixed(8)
      }

      if (parseFloat(item.value) > 0) {
        totalAmount += new Number(item.value)
      }
    })

    responsePairs.data.map(item => {
      if (item.market === 'BNBETH') {
        bnbAmount = item.total_amount.toFixed(8)
      }
    })

    var reply = '*Saldo para Trade:*\n' + tcv + ' ' + responseConfig.data.market + '\n\n'
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
    reply += '*Mês*: ' + monthlyProfit + ' ' + responseConfig.data.market + ' (' + monthlyCount + ' trades)\n'

    ctx.reply(reply, { parse_mode: 'markdown' })
  }))
  .catch(err => {
    ctx.reply('Ops... Algo errado. ' + err)
    logger.error('Ops... Algo errado: ' + err)
  })
})
