require('dotenv').config()
const logger = require('./src/services/logger')
const bot = require('./src/services/telegram')

// Prototypes
require('./src/functions/prototypes')

// Comandos
require('./src/commands/profittrailer/saldo')
require('./src/commands/profittrailer/bags')
require('./src/commands/profittrailer/entradas')
require('./src/commands/binance/sell')

require('./src/commands/configs/list')
require('./src/commands/configs/switch')

require('./src/commands/calculadora')

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
