/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
const bot = require('../../services/telegram'),
  logger = require('../../services/logger'),
  axios = require('axios')

bot.command('config_switch', (ctx) => {
  logger.info('Pegando informações passadas')
  let configName = ctx.state.command.args
  if (configName === '') {
    ctx.reply(`Não foi informado o nome da configuração! Tente /config_list`)
    logger.error(`Não foi informado o nome da configuração! Tente /config_list`)
    return
  }
  const URL_LIST = process.env.PT_HOST + 'settingsapi/config/list?license=' + process.env.PROFITTRAILER_LICENSE
  const URL_SWITCH = process.env.PT_HOST + 'settingsapi/config/switch?license=' + process.env.PROFITTRAILER_LICENSE + '&configName='
  axios.post(URL_LIST)
    .then(responseList => {
      if (responseList.data.includes(configName)) {
        axios.post(URL_SWITCH + configName)
          .then(response => {
            logger.error(response)
            ctx.reply('Configuração alterada com sucesso!')
            logger.error('Configuração alterada com sucesso!')
          })
          .catch(err => {
            ctx.reply('Ops... Algo errado. ' + err)
            logger.error('Ops... Algo errado: ' + err)
          })

      } else {
        ctx.reply('Configuração ' + configName + ' não existe! Tente /config_list')
        logger.error('Configuração ' + configName + ' não existe! Tente /config_list')
      }
      logger.info('comando /config_switch respondido.')
    })
    .catch(err => {
      ctx.reply('Ops... Algo errado. ' + err)
      logger.error('Ops... Algo errado: ' + err)
    })
})
