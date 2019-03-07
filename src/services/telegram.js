const Telegraf = require('telegraf')
const telegram = new Telegraf(process.env.TELEGRAM_API_TOKEN)

module.exports = telegram
