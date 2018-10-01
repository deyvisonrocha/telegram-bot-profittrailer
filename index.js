require('dotenv').config()
const logger = require('./src/services/logger')
const bot = require('./src/services/telegram')

// Comandos
require('./src/commands/saldo')
require('./src/commands/bags')
require('./src/commands/sell')

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
