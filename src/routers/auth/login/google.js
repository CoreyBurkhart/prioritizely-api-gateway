import jwt from 'jsonwebtoken';
import UserModel from './../../../db/models/User';
import {createJWT, validateGoogleIdToken} from '../../../lib/auth';
import JwtCookieOptions from '../../../lib/classes/JwtCookieOptions';
import signupUser from './../signup/signup';

/**
 * @param {Object} res
 * @param {String} email
 * @return {Object} res
 */
function attachNewJWT(res, email) {
  const token = createJWT({email});

  return res
    .cookie('token', token, new JwtCookieOptions());
}

/**
 * FULL ROUTE: POST /api/login/google
 *
 * Recieve data from clientside google signin. User can be signed up if it's
 * their first time logging in or just logged in.

 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export default async function(req, res, next) {
  const {idToken} = req.body;
  const {token} = req.cookies;
  const googleTokenInfo = await validateGoogleIdToken(idToken);

  if (googleTokenInfo instanceof Error) {
    return next(googleTokenInfo);
  }

  // get the user info
  const {email, picture, name} = googleTokenInfo;

  // check if we have and user w/ that email
  let user;
  try {
    user = await UserModel.findByEmail(email);
  } catch (err) {
    next(err);
  }

  if (user && token) {
    // make sure their token matches the current account
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // token expired, etc. reissue token
      attachNewJWT(res, email)
        .status(200)
        .send({
          newUser: false,
        });
    }

    if (decoded.data.email !== email) {
      // issue new token
      attachNewJWT(res, email)
        .status(200)
        .send({
          newUser: false,
        });
    } else {
      // they are already logged in..
      res.status(200)
        .send({
          newUser: false,
        });
    }
  } else if (user && !token) {
    // issue a new token
    attachNewJWT(res, email)
      .status(200)
      .send({
        newUser: false,
      });
  } else {
    // we dont have an account yet sign them up...
    signupUser({
      email,
      name,
      image: picture,
      id_token: idToken,
    }).then(({token}) => {
      res.status(200)
        .cookie('token', token, new JwtCookieOptions())
        .send({
          newUser: true,
        });
    })
    .catch(({messages, status}) => {
      res.status(status || 500)
        .send({messages});
    });
  }
};
