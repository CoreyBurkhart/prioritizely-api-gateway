const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

try {
  process.env.JWT_SECRET = fs.readFileSync(path.resolve(__dirname, '../private_key.pem'));
} catch (error) {
  process.stderr.write(chalk.red.bold('Cannot read JWT private key. Use yarn keygen to generate one.'));
  process.exit(1)
}
