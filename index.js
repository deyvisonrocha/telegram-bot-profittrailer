const Telegraf = require('telegraf')
const axios = require('axios')

const bot = new Telegraf('523458627:AAEE5mpKsyBUeoMbKkbe7tLSSlq61Aik3SE')

bot.command('saldo', (ctx) => {
  var bnbBalance

  axios.get('http://bit.deyvisonrocha.com/api/data?token=3AB3C3945E908FA30CCB575E28C8CED0EB8DB2B8C54E446D2897F4D0D8940332')
  .then(r => {
    var balance = r.data.realBalance + r.data.totalDCACurrentValue + r.data.totalPairsCurrentValue + r.data.totalPendingCurrentValue + r.data.totalDustCurrentValue
    var reply = '<b>' + r.data.sitename + '</b> v2\n\n'
    reply += '<b>Saldo em ' + r.data.market + ':</b>\n'
    reply += balance + '\n\n'
    reply += '<b>Resultados:</b>\n'
    reply += 'Hoje: ' + r.data.stats.totalProfitPercToday + '% (' + r.data.stats.totalSalesToday + ' trades)\n'
    reply += 'Ontem: ' + r.data.stats.totalProfitPercYesterday + '% (' + r.data.stats.totalSalesYesterday + ' trades)\n'
    reply += 'Esta semana: ' + r.data.stats.totalProfitPercWeek + '% (' + r.data.stats.totalSalesWeek + ' trades)\n'

    ctx.reply(reply, { parse_mode: 'HTML' })
  })
  .catch(err => {
    ctx.reply('Ops... Algo errado. ' + err)
  })
})
bot.startPolling()
