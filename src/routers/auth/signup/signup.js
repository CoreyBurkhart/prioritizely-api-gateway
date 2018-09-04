import UserModel from './../../../db/models/User';
import {createJWT, hashPassword} from '../../../lib/auth';
import {INVALID_PASSWORD, NON_UNIQUE_EMAIL} from '../../../lib/error-messages';
import trim from 'validator/lib/trim';


/**
 * @param {Object} userData
 *  @prop {String} name required
 *  @prop {String} email required
 *  @prop {String} image optional
 *  @prop {String} password optional
 * @return {Promise}
 */
export default async function(userData) {
  const {id_token: idToken, name, image, email, password} = userData;
  let response = new Promise(async (resolve, reject) => {
    let passwordHash;

    // only validate password if we don't have a token from ex. google auth
    if (!idToken) {
      if (password && UserModel.validatePassword(password)) {
        passwordHash = await hashPassword(password);
      } else {
        return reject({
          messages: [INVALID_PASSWORD],
          status: 400,
        });
      }
    }

    const user = new UserModel({
      email: trim(email),
      name: trim(name),
      hash: passwordHash,
      image,
    });

    if (! (await user.isUnique())) {
      return reject({
        messages: [NON_UNIQUE_EMAIL],
        status: 400,
      });
    }

    user.save()
      .then(() => {
        const token = createJWT({
          email,
        });
        resolve({token});
      })
      .catch((err) => {
        if (err.errors) {
          let messages = Object.keys(err.errors).map(
            ({message, $isValidationError}) => {
              if ($isValidationError) {
                return message;
              }
          });
          reject({
            messages,
            status: 400,
          });
        }
      });
    });

  return response;
}
