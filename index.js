require('dotenv').config()
const logger = require('./src/services/logger')
const bot = require('./src/services/telegram')

// Comandos
const saldo = require('./src/commands/saldo')
const bags = require('./src/commands/bags')

// bot.startPolling()
// logger.info('Telegram polling')

bot.telegram.getMe()
  .then((botInfo) => {
    logger.info(`Bot username: @${botInfo.username}`)
    bot.options.username = botInfo.username
    return botInfo
  }).then((botInfo) => {
    bot.startPolling()
    logger.info('Telegram polling')
    return botInfo
  })
