import jwt from 'jsonwebtoken';

/**
 * @param {Object} res
 * @return {Object}
 */
function clearAndRedirect(res) {
  return res
    .clearCookie('token')
    .clearCookie('authenticated')
    .redirect('/signin');
}

/**
 * @summary protect from unauthenticated reqests.
 * @description
 *  - redirect to signin if not authenticated.
 *  - attach decoded token to req object if user authenticated.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @see {@link https://expressjs.com/en/guide/writing-middleware.html|express docs}
 * @return {Object}
 */
export default function(req, res, next) {
  const {token} = req.cookies;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (e) {
      return clearAndRedirect(res);
    }
  } else {
    return clearAndRedirect(res);
  }
}
