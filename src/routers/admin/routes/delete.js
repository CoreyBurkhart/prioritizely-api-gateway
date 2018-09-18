import UserModel from '@/db/models/User';

/**
 * Delete a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function deleteUser(req, res, next) {
  const {id: userId} = req.decoded_jwt.data;

  UserModel.findByIdAndDelete(userId)
    .then((r) => {
      res.status(200)
        .json({
          userId,
          d: req.decoded_jwt,
        });
    })
    .catch(next);
}

export default deleteUser;
