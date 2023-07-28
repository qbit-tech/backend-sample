/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  apps: [
    {
      name: 'vines-scheduler-staging',
      script: './main.js',
      watch: true,
      exp_backoff_restart_delay: 100,
    },
  ],
};
