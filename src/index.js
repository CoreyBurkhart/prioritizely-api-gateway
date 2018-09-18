import app from './app';
import config from './../config/config';
import mongoose from 'mongoose';
import chalk from 'chalk';

const dbUrl = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;

mongoose.connect(dbUrl)
  .then(() => {
    console.info(chalk.blue(`Successfully connected with ${dbUrl}`));

    app.listen(config.port, () => {
      console.info(chalk.blue(`Server listening on ports ${config.port}...`));
    });
  });
