/**
 * @class
 * @name JwtCookieOptions
 */
export default class JwtCookieOptions {
  /**
   * @constructor
   * @param {Object} options
   *  @see {@link express|https://expressjs.com/en/4x/api.html#res.cookie}
   */
  constructor(options = {}) {
    const {path, secure, httpOnly, encode, expires, maxAge, signed,
       sameSite} = options;
    this.path = path || '/';
    this.secure = secure || process.env.NODE_ENV === 'production';
    this.httpOnly = httpOnly || true;
    // default expiration date = one month
    this.expires = expires || (new Date(Date.now() + 1000 * 60 * 60 * 24 * 30));
    if (encode) this.encode = encode;
    if (maxAge) this.maxAge = maxAge;
    if (signed) this.signed = signed;
    if (sameSite) this.sameSite = sameSite;
  }
}
