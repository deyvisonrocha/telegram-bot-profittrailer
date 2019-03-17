'use strict';

var axios = require('axios');

var http = axios.create({
  baseURL: process.env.PT_HOST,
  timeout: 30000,
  params: {
    token: process.env.PROFITTRAILER_API_TOKEN
  }
});

module.exports = {
  http: http
};