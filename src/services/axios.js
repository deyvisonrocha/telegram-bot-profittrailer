const axios = require('axios')
const ptConfig = require('../config/pt')

const http = axios.create({
  baseURL: process.env.PT_HOST,
  timeout: 30000,
  params: {
    token: ptConfig.token
  }
})

// http.get('api/dca/log').then(r => console.log(r))

module.exports = {
  http: http
}
