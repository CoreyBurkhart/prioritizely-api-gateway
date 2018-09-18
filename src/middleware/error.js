import GeneralServerError from '../lib/classes/GeneralServerError';
const chalk = require('chalk');

/**
 * @param {*|Error} error
 */
function printError(error) {
  console.error(chalk.red.bold(error.message));
  console.error(chalk.red(error.stack));
}

/**
 * @summary default error handler
 * @param {*} err
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export default function(err, req, res, next) {
  process.env.NODE_ENV === 'production'
    ? null
    : printError(err);

  res.status(500)
    .send(new GeneralServerError(err));
};
