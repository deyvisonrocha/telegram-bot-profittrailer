/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../../services/telegram'),
  logger = require('../../services/logger'),
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

  const URL_MONHTY = process.env.PTTRACKER_HOST + 'monthly-sales.json',
    URL_DAILY = process.env.PTTRACKER_HOST + 'daily-sales.json',
    URL_TCV = process.env.PTTRACKER_HOST + 'tcv.json',
    URL_PAIRS = process.env.PTTRACKER_HOST + 'pairs.json',
    URL_CONFIGURATION = process.env.PTTRACKER_HOST + 'configuration.json'

  axios.all([
    axios.get(URL_MONHTY),
    axios.get(URL_DAILY),
    axios.get(URL_TCV),
    axios.get(URL_PAIRS),
    axios.get(URL_CONFIGURATION)
  ])
    .then(axios.spread((responseMonthly, responseDaily, responseTcv, responsePairs, responseConfig) => {
      let bnbAmount = 0
      let currentDate = responseDaily.data
      dailyPercent = currentDate
      dailyProfit = currentDate
      dailyProfitFiat = currentDate
      dailyProfitCount = currentDate

      let yesterdayData = responseDaily.data.slice(-2)[0]
      yesterdayPercent = yesterdayData.profit_percent.toFixed(2)
      yesterdayProfit = yesterdayData.profit.toFixed(8)
      yesterdayProfitFiat = yesterdayData.profit_fiat
      yesterdayProfitCount = yesterdayData.sell_count

      responseTcv.data.map(item => {
        if (item.key === 'realBalance') {
          tcv = parseFloat(item.value).toFixed(8)
        }

        if (parseFloat(item.value) > 0) {
          totalAmount += parseFloat(item.value)
        }
      })

      responsePairs.data.map(item => {
        if (item.market.includes('BNB')) {
          bnbAmount = item.total_amount.toFixed(8)
        }
      })

      reply = '*Saldos:*\n```\nDisponível para Trade: \n - ' + tcv + ' ' + responseConfig.data.market + '\n'
      reply += 'Saldo BNB: \n - ' + bnbAmount + ' BNB\n'
      reply += 'Saldo Total: \n - ' + totalAmount.toFixed(8) + ' ' + responseConfig.data.market + '```\n\n'
      reply += '*Resultados dos últimos 7 dias:*\n```\n'
      reply += 'Dia   | Ganho % | Ganho ' + responseConfig.data.market + '\n'
      reply += '----- | ------- | ---------- \n'
      responseDaily.data.slice(-7).map(item => {
        let dateStr = item.sold_date.split('-')
        reply += dateStr[2] + '/' + dateStr[1] + ' | ' + item.profit_percent.toFixed(2).toString().leftJustify(7, ' ') + ' | ' + item.profit.toFixed(8) + '\n'
      })
      reply += '```\n*Resultados dos últimos meses:*\n```\n'
      reply += 'Mês     | Ganho ' + responseConfig.data.market + '\n'
      reply += '------- | ---------- \n'
      responseMonthly.data.map(item => {
        let dateStr = item.sold_month.split('-')
        let valueProfit = item.profit * responseConfig.data.currencyPrice
        reply += dateStr[1] + '/' + dateStr[0] + ' | ' + item.profit.toFixed(8) + '\n'
      })
      reply += '```\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')'

      ctx.reply(reply, { parse_mode: 'markdown' })
      logger.info('comando /saldo respondido.')
    }))
    .catch(err => {
      ctx.reply('Ops... Algo errado. ' + err)
      logger.error('Ops... Algo errado: ' + err)
    })
})
