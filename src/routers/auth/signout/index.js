import JwtCookieOptions from '../../../lib/classes/JwtCookieOptions';


/**
 * Full Route: GET /api/auth/signout
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export default function(req, res, next) {
  // provide cookie options for browsers that require them for
  // a cookie to be deleted.
  const tokenCookieOptions = new JwtCookieOptions();
  delete tokenCookieOptions.expires;
  const flagCookieOptions = new JwtCookieOptions({httpOnly: false});
  delete flagCookieOptions.expires;

  res.clearCookie('token', tokenCookieOptions)
    .clearCookie('authenticated', flagCookieOptions)
    .redirect('/signin');
}
