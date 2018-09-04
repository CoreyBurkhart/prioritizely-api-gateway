import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {OAuth2Client} from 'google-auth-library';
import {INVALID_CREDENTIALS} from './error-messages';

/**
 * @param {Object} data
 * @param {Object} options
 * @return {String} token
 */
export function createJWT(data = {}, options = {}) {
  return jwt.sign({
      data,
    }, process.env.JWT_SECRET,
    {
      expiresIn: options.maxAge || 60 * 60 * 24 * 30,
      algorithm: options.algorithm || 'HS256',
    });
}

/**
 * @param {String} password
 * @param {Number} saltRounds
 */
export async function hashPassword(password, saltRounds = 10) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

/**
 * Send a invalid credential response.
 * @param {Object} res
 */
export function respondInvalidCred(res) {
  res.status(400)
    .send({
      messages: [INVALID_CREDENTIALS],
    });
};

/**
 * @param {String} idToken
 * @return {Object|Error}
 */
export async function validateGoogleIdToken(idToken) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  let ticket;

  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    return err;
  }

  const payload = await ticket.getPayload();
  return payload;
}
