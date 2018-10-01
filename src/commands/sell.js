const bot = require('../services/telegram')
const logger = require('../services/logger')
const { http } = require('../services/axios')
const {to} = require('await-to-js')
const Binance = require('binance-api-node').default
const commandParts = require('telegraf-command-parts');

const binance = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET
})

bot.use(commandParts())

bot.command('sell', async (ctx, next) => {
  let coinToSell = ctx.state.command.args
  logger.info('Pegando informações da moeda ' + coinToSell.toUpperCase())

  let coin

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

  // let reply = "*VENDA MANUAL*:\n"
  // reply += "Just sold: " + coin.market + "\n"
  // reply += "Sell strat: MANUAL"
  // reply += "Cost: 0.05042140"
  // reply += "Rate: 0.00252107"
  // reply += "Profit: 1.10%"
  // reply += "Profit ETH: 0.00054396"
})

const sellOrderOnBinance = async (coin) => {
  await binance.order({
    symbol: coin.market,
    side: 'SELL',
    quantity: parseFloat(coin.averageCalculator.totalAmount),
    type: 'MARKET'
  })
}

// const calculatePrice = (coin) => {
//   return parseInt(coin.averageCalculator.totalAmount) * coin.currentPrice
// }

// const calculateProfitInPercent = async (coin) => {
//   let orderDetail = await binance.allOrder({ symbol: coin.market })

//   let calculo = ((valorVenda - valorCompra) / valorCompra) * 100
// }

// const calculateProfit = async (coin)
