'use strict';

/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
var bot = require('../services/telegram'),
    logger = require('../services/logger'),
    axios = require('axios'),
    _require = require('./../functions/utils'),
    marketColumn = _require.marketColumn,
    marketRows = _require.marketRows;


var avaliableStrategies = ['SIGNAL', 'LOWBB', 'HIGHBB', 'GAIN', 'LOSS', 'SMAGAIN', 'EMAGAIN', 'HMAGAIN', 'DEMAGAIN', 'SMASPREAD', 'EMASPREAD', 'HMASPREAD', 'DEMASPREAD', 'SMACROSS', 'EMACROSS', 'HMACROSS', 'DEMACROSS', 'RSI', 'STOCH', 'STOCHRSI', 'STOCHRSID', 'STOCHRSIK', 'STOCHRSICROSS', 'MACD', 'BBWIDTH', 'OBV', 'PDHIGH', 'ANDERSON', 'DISABLED'];

function checkAndAdd(arr, item) {
  var found = arr.some(function (el) {
    return el.name === item.name;
  });
  if (!found) {
    arr.push({ name: item.name, entryValue: item.entryValue, entryValueLimit: item.entryValueLimit });
  }
}

bot.command('entradas', function (ctx) {
  logger.info('Pegando informações Possible Buys');
  var URL_POSSIBLE_BUYS = process.env.PTTRACKER_HOST + 'possible-buys.json';
  axios.get(URL_POSSIBLE_BUYS).then(function (response) {
    var ordered = response.data;
    var legenda = [];
    ordered.sort(function (a, b) {
      return a.perc_change - b.perc_change;
    });
    var reply = '*Entradas:* \n```\n';
    reply += marketColumn() + ' | Estratégias \n';
    reply += '------- | ----------------------- \n';
    ordered.map(function (dado) {
      var estrategias = JSON.parse(dado.buy_strategy);
      reply += marketRows(dado.market);
      estrategias.map(function (item) {
        if (avaliableStrategies.indexOf(item.name) > -1) {
          checkAndAdd(legenda, item);
          reply += item.currentValue.toFixed(2).toString() + ' ' + (item.positive === 'true' ? '✅' : '❌') + ' ';
        }
      });
      reply += '\n';
    });
    reply += '\n';
    legenda.map(function (dado) {
      reply += dado.name + ': ' + dado.entryValue + ' (Limite: ' + dado.entryValueLimit + ')\n';
    });
    reply += '```';
    reply += '\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')';
    ctx.reply(reply, { parse_mode: 'markdown' });
    logger.info('comando /entradas respondido.');
  }).catch(function (err) {
    ctx.reply('Ops... Algo errado. ' + err);
    logger.error('Ops... Algo errado: ' + err);
  });
});