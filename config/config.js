// require('dotenv').config()
require('./get-jwt-key.js');
require('./get-google-path.js');
const env = process.env.NODE_ENV;

const development = {
  port: 8081,
  db: {
    host: 'localhost',
    port: 27017,
    name: 'prioritizely-development',
  },
  proxy: {
    default: {
      url: 'http://localhost:8082',
    },
  },
};

const test = {
  port: 8081,
  db: {
    host: 'localhost',
    port: 27017,
    name: 'prioritizely-test',
  },
  proxy: {
    default: {
      url: 'http://localhost:8082',
    },
  },
};

const production = {
  port: 8081,
  db: {
    host: 'localhost',
    port: 27017,
    name: 'prioritizely-production',
  },
  proxy: {
    default: {
      url: 'http://localhost:8082',
    },
  },
};

const config = {
  development,
  test,
  production,
};

if (! env in config) {
  console.warn(`NODE_ENV=${env}. Defaulting to "development" environment.`);
}

module.exports = config[env] || development;
