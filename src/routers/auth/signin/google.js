import jwt from 'jsonwebtoken';
import UserModel from './../../../db/models/User';
import {validateGoogleIdToken} from '../../../lib/auth';
import signupUser from './../signup/signup';

/**
 * FULL ROUTE: POST /api/signin/google
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

  const {_id: uId} = user;

  if (user && token) {
    // make sure their token matches the current account
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // token expired, etc. reissue token
      return UserModel.removeAuthCookies(res)
        .redirect('/signin');
    }

    if (decoded.data.id !== uId) {
      // issue new token
      return user.addAuthCookies(res)
        .status(200)
        .send({
          newUser: false,
        });
    } else {
      // they are already logged in..
      return res.status(200)
        .send({
          newUser: false,
        });
    }
  }

  if (user && !token) {
    // issue a new token
    return user.addAuthCookies(res)
      .status(200)
      .send({
        newUser: false,
      });
  } else {
    // we dont have an account yet sign them up...
    signupUser({
      email: email,
      name: name,
      image: picture,
      id_token: idToken,
    }).then(({user}) => {
      return user.addAuthCookies(res)
        .status(200)
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
