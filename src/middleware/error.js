import GeneralServerError from '../lib/classes/GeneralServerError';
const chalk = require('chalk');

/**
 * "Catch all" error handling middleware.
 * @param {Error} err
 * @param {Object} res
 */
export default function(err, res) {
  if (err.stack) {
    process.stderr.write(chalk.red.bold(err.stack));
  }

  process.env.NODE_ENV === 'production'
    ? null
    : console.error(err);

  res.status(500)
    .send(new GeneralServerError(err.stack));
};
