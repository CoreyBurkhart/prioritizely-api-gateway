import proxy from 'http-proxy-middleware';
import config from './../../config/config';
import jwt from 'jsonwebtoken';

const options = {
  target: config.proxy.default.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/',
  },

  /**
   * decrpyt the jwt and attach the user email as a header on the proxy req
   * Note: since this has been through the auth middleware, we know the jwt
   * won't throw an error.
   * @param {Object} proxyReq
   * @param {Object} req
   * @param {Object} res
   */
  onProxyReq(proxyReq, req, res) {
    const {token} = req.cookies;
    proxyReq.setHeader(
      'x-user-email',
      (jwt.verify(token, process.env.JWT_SECRET)).data.email
    );
  },
};

export default proxy(options);
