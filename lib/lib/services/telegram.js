'use strict';

var Telegraf = require('telegraf');
var telegram = new Telegraf(process.env.TELEGRAM_API_TOKEN);

module.exports = telegram;