import proxy from 'http-proxy-middleware';
import config from './../../config/config';

const options = {
  target: config.proxy.default.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/',
  },
};

export default proxy(options);
