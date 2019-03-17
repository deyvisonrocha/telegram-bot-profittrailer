'use strict';

/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
var bot = require('../../services/telegram'),
    logger = require('../../services/logger'),
    axios = require('axios');

bot.command('config_switch', function (ctx) {
  logger.info('Pegando informações passadas');
  var configName = ctx.state.command.args;
  if (configName === '') {
    ctx.reply('N\xE3o foi informado o nome da configura\xE7\xE3o! Tente /config_list');
    logger.error('N\xE3o foi informado o nome da configura\xE7\xE3o! Tente /config_list');
    return;
  }
  var URL_LIST = process.env.PT_HOST + 'settingsapi/config/list?license=' + process.env.PROFITTRAILER_LICENSE;
  var URL_SWITCH = process.env.PT_HOST + 'settingsapi/config/switch?license=' + process.env.PROFITTRAILER_LICENSE + '&configName=';
  axios.post(URL_LIST).then(function (responseList) {
    if (responseList.data.includes(configName)) {
      axios.post(URL_SWITCH + configName).then(function (response) {
        logger.error(response);
        ctx.reply('Configuração alterada com sucesso!');
        logger.error('Configuração alterada com sucesso!');
      }).catch(function (err) {
        ctx.reply('Ops... Algo errado. ' + err);
        logger.error('Ops... Algo errado: ' + err);
      });
    } else {
      ctx.reply('Configuração ' + configName + ' não existe! Tente /config_list');
      logger.error('Configuração ' + configName + ' não existe! Tente /config_list');
    }
    logger.info('comando /config_switch respondido.');
  }).catch(function (err) {
    ctx.reply('Ops... Algo errado. ' + err);
    logger.error('Ops... Algo errado: ' + err);
  });
});