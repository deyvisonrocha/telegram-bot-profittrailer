'use strict';

/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */

var bot = require('../../services/telegram'),
    logger = require('../../services/logger'),
    axios = require('axios');

bot.command('config_list', function (ctx) {
  logger.info('Pegando lista de configurações do ProfitTrailer');
  var URL_DATA = process.env.PT_HOST + 'api/data?token=' + process.env.PROFITTRAILER_API_TOKEN;
  var URL_SETTINGS = process.env.PT_HOST + 'settingsapi/config/list?license=' + process.env.PROFITTRAILER_LICENSE;
  axios.all([axios.get(URL_DATA), axios.post(URL_SETTINGS)]).then(axios.spread(function (responseData, responseSettings) {
    var selectedConfig = responseData.data.selectedConfig;
    var data = responseSettings.data;
    var reply = '*Configurações:* \n```\n\n';
    data.map(function (dado) {
      if (dado === selectedConfig) {
        reply += '[X] ';
      } else {
        reply += '[ ] ';
      }
      reply += '' + dado;
      reply += '\n';
    });
    reply += '```';
    reply += '\n[Acessar o ProfitTrailer](' + process.env.PT_HOST + ')';
    ctx.reply(reply, { parse_mode: 'markdown' });
    logger.info('comando /config_list respondido.');
  })).catch(function (err) {
    ctx.reply('Ops... Algo errado. ' + err);
    logger.error('Ops... Algo errado: ' + err);
  });
});