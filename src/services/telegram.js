const Telegraf = require('telegraf')
const telegramConfig = require('../config/telegram')
const telegram = new Telegraf(telegramConfig.key, { username: telegramConfig.username })

module.exports = telegram
