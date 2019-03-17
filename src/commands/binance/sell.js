/* eslint-disable no-unused-vars */
/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../../services/telegram'),
  logger = require('../../services/logger'),
  { http } = require('../../services/axios'),
  { to } = require('await-to-js'),
  Binance = require('binance-api-node').default,
  commandParts = require('telegraf-command-parts'),
  binance = Binance({
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_API_SECRET
  }),
  sellOrderOnBinance = async (coin) => {
    await binance.order({
      symbol: coin.market,
      side: 'SELL',
      quantity: parseFloat(coin.averageCalculator.totalAmount),
      type: 'MARKET'
    })
  }

bot.use(commandParts())

bot.command('sell', async (ctx) => {
  if (ctx.message.from.id.toString() !== process.env.TELEGRAM_ADMIN_ID) {
    ctx.reply('Comando não encontrado.')
    return
  }

  let coinToSell = ctx.state.command.args,
    coin
  logger.info('Pegando informações da moeda ' + coinToSell.toUpperCase())

  await http.get('api/dca/log')
    .then(r => {
      coin = r.data.filter(item => {
        return coinToSell.toLowerCase() === item.currency.toLowerCase()
      })[0]
    })

  if (!coin) {
    ctx.reply('Moeda não encontrada!')
    return
  }

  ctx.reply('Foi enviada uma ordem de VENDA para a moeda ' + coin.currency + '!')
  await sellOrderOnBinance(coin)
})
