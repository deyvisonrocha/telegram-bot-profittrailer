require('dotenv').config()
const logger = require('./src/services/logger')
const bot = require('./src/services/telegram')

// Prototypes
require('./src/functions/prototypes')

// Comandos
require('./src/commands/saldo')
require('./src/commands/bags')
require('./src/commands/entradas')
require('./src/commands/sell')

require('./src/commands/configs/list')
require('./src/commands/configs/switch')

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
