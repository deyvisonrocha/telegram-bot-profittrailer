'use strict';

/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
var bot = require('../services/telegram'),
    logger = require('../services/logger'),
    axios = require('axios'),
    _require = require('./../functions/utils'),
    marketColumn = _require.marketColumn,
    marketRows = _require.marketRows;


bot.command('bags', function (ctx) {
  logger.info('Pegando informações DCAs');
  var URL_DCA = process.env.PTTRACKER_HOST + 'dca.json';
  axios.get(URL_DCA).then(function (response) {
    var ordered = response.data;
    ordered.sort(function (a, b) {
      return b.profit - a.profit;
    });

    var reply = '*Bags:* \n```\n';
    reply += marketColumn() + ' | Profit % | Entradas \n';
    reply += '------- | -------- | -------- \n';
    ordered.map(function (dado) {
      reply += marketRows(dado.market) + dado.profit.toFixed(2).toString().leftJustify(8, ' ') + ' | ' + dado.bought_times.toString().leftJustify(8, ' ') + '\n';
    });

    reply += '```';
    reply += '\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')';

    ctx.reply(reply, { parse_mode: 'markdown' });
    logger.info('comando /bags respondido.');
  }).catch(function (err) {
    ctx.reply('Ops... Algo errado. ' + err);
    logger.error('Ops... Algo errado: ' + err);
  });
});