require('dotenv').config()
const logger = require('./src/services/logger')
const bot = require('./src/services/telegram')

String.prototype.leftJustify = function( length, char ) {
  var fill = []
  while ( fill.length + this.length < length ) {
    fill[fill.length] = char
  }
  return fill.join('') + this
}

String.prototype.rightJustify = function( length, char ) {
  var fill = []
  while ( fill.length + this.length < length ) {
    fill[fill.length] = char
  }
  return this + fill.join('')
}

// Comandos
require('./src/commands/saldo')
require('./src/commands/bags')
require('./src/commands/entradas')
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
