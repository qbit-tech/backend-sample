/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  apps: [
    {
      name: 'trackme-api-development',
      script: './main.js',
      watch: true,
      exp_backoff_restart_delay: 100,
    },
  ],
};
