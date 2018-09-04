const chalk = require('chalk');

try {
  const { client_id, client_secret } = require('../google_credentials.json').web;
  process.env.GOOGLE_CLIENT_ID = client_id;
  process.env.GOOGLE_CLIENT_SECRET = client_secret;
} catch(err) {
  process.stderr.write(chalk.red.bold('Cannot read google_credentials.json file. Download it from console.developers.google.com'));
  process.exit(1)
}