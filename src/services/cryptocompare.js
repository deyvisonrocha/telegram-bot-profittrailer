const axios = require('axios')

const http = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data/',
  timeout: 30000,
  params: {
    token: process.env.CRYPTOCOMPARE_API_TOKEN
  }
})

module.exports = {
  http: http
}
