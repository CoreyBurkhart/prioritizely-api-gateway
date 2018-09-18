import mongoose from 'mongoose';
import validator from 'validator';
import options from './options';
import * as statics from './statics';
import * as methods from './methods';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },

  hash: {
    required: false,
    type: String,
  },

  name: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return !validator.isEmpty(value) && value.length < 200;
      },
      message: () => `names should be 1-200 characters long.`,
    },
  },

  image: {
    type: String,
    required: false,
    validate: {
      validator: validator.isURL,
    },
  },
}, options);

UserSchema.statics = statics;
UserSchema.methods = methods;

export default UserSchema;
