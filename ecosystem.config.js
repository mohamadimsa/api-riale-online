// PM2 CONFIGURATION FOR PRODUCTION BUILDS

module.exports = {
  apps : [{
    name: "kraaken-api",
    script: "./app.js",
    args: "start",
    exec_mode: 'fork',
    instances: "1",
    max_memory_restart: "500M",
    combine_logs: true,
    autorestart: true,
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    },
  }],

  deploy : {
    production : {
      user : 'root',
      host : '139.177.182.131',
      ref  : 'origin/main',
      key: 'deploy.key',
      password: 'kraaken',
      repo : 'git@github.com:kraken-security/api.git',
      path : '/var/www/api',
      'post-deploy' : 'npm install --include=dev && cp ./.env.prod ./.env && cp ./configuration/soracom.js ./node_modules/soracom/lib/soracom.js && prisma migrate deploy && prisma generate && npm run link && pm2 reload ecosystem.config.js --env production && pm2 save',
    }
  }
};
