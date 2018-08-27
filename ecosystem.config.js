module.exports = {
  apps: [{
    name: 'Telegram BOT',
    script: 'index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
  }
}
