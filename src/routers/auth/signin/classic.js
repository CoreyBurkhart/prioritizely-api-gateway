/* eslint new-cap: 0 */

import UserModel from '../../../db/models/User';
import bcrypt from 'bcrypt';
import {respondInvalidCred} from '../../../lib/auth';

/**
 * FULL ROUTE: POST /api/signin
 *
 * Verify that user exists, and that password hashes match.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export default async function(req, res, next) {
  const {body: credentials} = req;
  let user;

  try {
    user = await UserModel.findByEmail(credentials.email);
  } catch (err) {
    next(err);
  }

  if (user) {
    // compare password hashes
    const passwordsMatch
      = await bcrypt.compare(credentials.password, user.hash);

    if (passwordsMatch) {
      // success
      user.addAuthCookies(res)
        .status(200)
        .send(true);
    } else {
      respondInvalidCred(res);
    }
  } else {
    respondInvalidCred(res);
  }
}
