import JwtCookieOptions from '@/lib/classes/JwtCookieOptions';

/**
 * @this mongoose.Schema
 * @alias mongoose.findOne
 * @param {Object} email
 * @return {Promise}
 */
export function findByEmail(email) {
  return this.findOne({email});
}

/**
 * @param {String} pass
 * @param {Number} minLength
 * @param {Number} maxLength
 * @return {Boolean} validity
 */
export function validatePassword(pass, minLength = 7, maxLength = 100) {
  return pass.length > minLength && pass.length < maxLength;
}

/**
 * @summary Generate the cookies to be set for authenticated user.
 * @example <code>
 *  [ token, flag ] = user.genCookies(token);
 *  res
 *    .cookie(...token)
 *    .cookie(...flag)
 *    ...
 *  </code>
 * @param {*} token
 * @return {Array<array>}
 */
export function genCookies(token) {
  const tokenCookie = ['token', token, new JwtCookieOptions()];
  const authFlagCookie = [
    'authenticated',
    'true',
    new JwtCookieOptions({httpOnly: false}),
  ];

  return [tokenCookie, authFlagCookie];
}

/**
 * @summary remove auth cookies from a res object w/ same options as the
 * were created with.
 * @param {Object} res
 * @return {Object} res
 */
export function removeAuthCookies(res) {
  const [tokenArgs, flagArgs] = genCookies();

  return res
    .clearCookie(tokenArgs[0], tokenArgs[2])
    .clearCookie(flagArgs[0], flagArgs[2]);
}
