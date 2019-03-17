'use strict';

/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */

var bot = require('../services/telegram'),
    logger = require('../services/logger'),
    axios = require('axios');

bot.command('saldo', function (ctx) {
  logger.info('Pegando informações gerais');
  var dailyPercent = void 0,
      dailyProfit = void 0,
      dailyProfitFiat = void 0,
      dailyProfitCount = void 0,
      yesterdayPercent = void 0,
      yesterdayProfit = void 0,
      yesterdayProfitFiat = void 0,
      yesterdayProfitCount = void 0,
      monthlyProfit = void 0,
      monthlyCount = void 0,
      tcv = void 0,
      bnbAmount = void 0,
      totalAmount = 0,
      reply = void 0;

  var URL_MONHTY = process.env.PTTRACKER_HOST + 'monthly-sales.json',
      URL_DAILY = process.env.PTTRACKER_HOST + 'daily-sales.json',
      URL_TCV = process.env.PTTRACKER_HOST + 'tcv.json',
      URL_PAIRS = process.env.PTTRACKER_HOST + 'pairs.json',
      URL_CONFIGURATION = process.env.PTTRACKER_HOST + 'configuration.json';

  axios.all([axios.get(URL_MONHTY), axios.get(URL_DAILY), axios.get(URL_TCV), axios.get(URL_PAIRS), axios.get(URL_CONFIGURATION)]).then(axios.spread(function (responseMonthly, responseDaily, responseTcv, responsePairs, responseConfig) {
    var bnbAmount = 0;
    var currentDate = responseDaily.data;
    dailyPercent = currentDate;
    dailyProfit = currentDate;
    dailyProfitFiat = currentDate;
    dailyProfitCount = currentDate;

    var yesterdayData = responseDaily.data.slice(-2)[0];
    yesterdayPercent = yesterdayData.profit_percent.toFixed(2);
    yesterdayProfit = yesterdayData.profit.toFixed(8);
    yesterdayProfitFiat = yesterdayData.profit_fiat;
    yesterdayProfitCount = yesterdayData.sell_count;

    responseTcv.data.map(function (item) {
      if (item.key === 'realBalance') {
        tcv = parseFloat(item.value).toFixed(8);
      }

      if (parseFloat(item.value) > 0) {
        totalAmount += parseFloat(item.value);
      }
    });

    responsePairs.data.map(function (item) {
      if (item.market.includes('BNB')) {
        bnbAmount = item.total_amount.toFixed(8);
      }
    });

    reply = '*Saldos:*\n```\nDisponível para Trade: ' + tcv + ' ' + responseConfig.data.market + '\n';
    reply += bnbAmount + ' BNB\n';
    reply += totalAmount.toFixed(8) + ' ' + responseConfig.data.market + '```\n\n';
    reply += '*Resultados dos últimos 7 dias:*\n```\n';
    reply += 'Dia   | Ganho % | Ganho ' + responseConfig.data.market + '\n';
    reply += '----- | ------- | ---------- \n';
    responseDaily.data.slice(-7).map(function (item) {
      var dateStr = item.sold_date.split('-');
      reply += dateStr[2] + '/' + dateStr[1] + ' | ' + item.profit_percent.toFixed(2).toString().leftJustify(7, ' ') + ' | ' + item.profit.toFixed(8) + '\n';
    });
    reply += '```\n*Resultados dos últimos meses:*\n```\n';
    reply += 'Mês     | Ganho ' + responseConfig.data.market + '\n';
    reply += '------- | ---------- \n';
    responseMonthly.data.map(function (item) {
      var dateStr = item.sold_month.split('-');
      var valueProfit = item.profit * responseConfig.data.currencyPrice;
      reply += dateStr[1] + '/' + dateStr[0] + ' | ' + item.profit.toFixed(8) + '\n';
    });
    reply += '```\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')';

    ctx.reply(reply, { parse_mode: 'markdown' });
    logger.info('comando /saldo respondido.');
  })).catch(function (err) {
    ctx.reply('Ops... Algo errado. ' + err);
    logger.error('Ops... Algo errado: ' + err);
  });
});