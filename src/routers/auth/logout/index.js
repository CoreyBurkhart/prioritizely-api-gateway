import JwtCookieOptions from '../../../lib/classes/JwtCookieOptions';


/**
 * Full Route: GET /api/auth/logout
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export default function(req, res, next) {
  // provide cookie options for browsers that require them for
  // a cookie to be deleted.
  const cookieOptions = new JwtCookieOptions();
  delete cookieOptions.expires;

  res.clearCookie('token', cookieOptions)
    .redirect('/login');
}
