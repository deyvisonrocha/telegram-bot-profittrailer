module.exports = {
  apps: [{
    name: 'profittrailer-bot',
    script: 'babel-node index.js',
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
