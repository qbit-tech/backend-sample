require('dotenv').config({
  path: process.env.ENV_PATH
});

module.exports = {
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',

    dialectOptions: {
      pool: {
        min: 0,
        max: 10,
        acquire: 10,
        idle: 5,
      },
    },
  },
  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',

    dialectOptions: {
      pool: {
        min: 0,
        max: 10,
        acquire: 10,
        idle: 5,
      },
    },
  },
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',

    dialectOptions: {
      pool: {
        min: 0,
        max: 10,
        acquire: 10,
        idle: 5,
      },
    },
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',

    dialectOptions: {
      pool: {
        min: 0,
        max: 10,
        acquire: 10,
        idle: 5,
      },
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      pool: {
        min: 0,
        max: 10,
        acquire: 10,
        idle: 5,
      },
    },
  },
};

