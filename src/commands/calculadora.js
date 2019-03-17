/* eslint-disable no-unused-vars */
/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../services/telegram'),
  logger = require('../services/logger'),
  { http } = require('../services/cryptocompare'),
  { to } = require('await-to-js'),
  commandParts = require('telegraf-command-parts')

bot.use(commandParts())

bot.command('calcular', async (ctx) => {
  let args = ctx.state.command.splitArgs
  if (args.length < 2) {
    ctx.reply('Erro ao executar comando. Você deverá passar 3 parâmetros para cálculo. \n\n**Exemplo:** \n```\n/calcular 1 btc btl\n```', { parse_mode: 'markdown' })
  }

  let quantidade = parseInt(args[0])
  let moedaA = args[1].toUpperCase()
  let moedaB = args[2] ? args[2].toUpperCase() : 'BRL'

  await http.get('price', {
    params: {
      fsym: moedaA,
      tsyms: moedaB.toUpperCase()
    }
  })
    .then(r => {
      if (r.status === 200) {
        let response = r.data
        let msg = `*Calculadora & Conversora:*\n\n`
        msg += `Moeda A: *${moedaA}*\n`
        msg += `Moeda B: *${moedaB}*\n`
        msg += `Quantidade: ${quantidade}\n`
        let calc = quantidade * parseFloat(r.data[moedaB])
        msg += `Valor: *${calc.toFixed(2)}*\n`
        ctx.reply(msg, { parse_mode: 'markdown' })
      }

    })
    .catch(e => {
      console.log(e)
    })

  // if (ctx.message.from.id.toString() !== process.env.TELEGRAM_ADMIN_ID) {
  //   ctx.reply('Comando não encontrado.')
  //   return
  // }

  // let coinToSell = ctx.state.command.args,
  //   coin
  // logger.info('Pegando informações da moeda ' + coinToSell.toUpperCase())

  // await http.get('api/dca/log')
  //   .then(r => {
  //     coin = r.data.filter(item => {
  //       return coinToSell.toLowerCase() === item.currency.toLowerCase()
  //     })[0]
  //   })

  // if (!coin) {
  //   ctx.reply('Moeda não encontrada!')
  //   return
  // }

  // ctx.reply('Foi enviada uma ordem de VENDA para a moeda ' + coin.currency + '!')

})
