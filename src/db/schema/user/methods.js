import {createJWT} from '@/lib/auth';

/**
 * @this mongoose.Schema
 * @param {Object} res express response object
 * @param {String} user user instance
 * @return {Object} res
 */
export function addAuthCookies(res) {
  const token = this.genJwt();
  const [tokenArgs, flagArgs] = this.constructor.genCookies(token);

  return res
    .cookie(...tokenArgs)
    .cookie(...flagArgs);
}

/**
 * @this mongoose.Schema
 * @param {Object} options
 * @return {String|Error} token
 */
export function genJwt(options = {}) {
  const data = {id: this._id};
  return createJWT(data, options);
};

/**
 * @async
 * @this mongoose.Schema
 * @return {Boolean}
 */
export async function isUnique() {
  const user = await this.constructor.findByEmail(this.email);
  return user === null;
}
