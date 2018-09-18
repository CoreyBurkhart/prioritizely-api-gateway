import morgan from 'morgan';

const logLevel = process.env.NODE_ENV === 'production'
  ? 'common'
  : 'dev';

export default morgan(logLevel);
