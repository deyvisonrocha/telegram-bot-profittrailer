'use strict';

/* eslint-disable no-unused-vars */
/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
var bot = require('../services/telegram'),
    logger = require('../services/logger'),
    _require = require('../services/axios'),
    http = _require.http,
    _require2 = require('await-to-js'),
    to = _require2.to,
    Binance = require('binance-api-node').default,
    commandParts = require('telegraf-command-parts'),
    binance = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET
}),
    sellOrderOnBinance = async function sellOrderOnBinance(coin) {
  await binance.order({
    symbol: coin.market,
    side: 'SELL',
    quantity: parseFloat(coin.averageCalculator.totalAmount),
    type: 'MARKET'
  });
};


bot.use(commandParts());

bot.command('sell', async function (ctx) {
  var coinToSell = ctx.state.command.args,
      coin = void 0;
  logger.info('Pegando informações da moeda ' + coinToSell.toUpperCase());

  await http.get('api/dca/log').then(function (r) {
    coin = r.data.filter(function (item) {
      return coinToSell.toLowerCase() === item.currency.toLowerCase();
    })[0];
  });

  if (!coin) {
    ctx.reply('Moeda não encontrada!');
    return;
  }

  ctx.reply('Foi enviada uma ordem de VENDA para a moeda ' + coin.currency + '!');
  await sellOrderOnBinance(coin);
});