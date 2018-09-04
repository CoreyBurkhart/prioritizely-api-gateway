/* eslint new-cap: 0 */

import JwtCookieOptions from '../../../lib/classes/JwtCookieOptions';
import signup from './signup';


/**
 * FULL ROUTE: POST /api/auth/signup
 *
 * Take an email & password combination, validate, store, and set a cookie to
 * a JWT if successful.
 *
 * @param {Object} req
 * @param {Object} res
 */
export default async function(req, res) {
  signup(req.body)
    .then(({token}) => {
      res.status(200)
        .cookie('token', token, new JwtCookieOptions())
        .send(req.body);
    })
    .catch(({messages, status}) => {
      res.status(status)
        .send({
          messages,
        });
    });
}
