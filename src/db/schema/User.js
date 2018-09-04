import mongoose from 'mongoose';
import validator from 'validator';

const options = {
  timestamps: true,
};

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

UserSchema.statics.validatePassword = function(pass, minLength = 7,
  maxLength = 100) {
  return pass.length > minLength && pass.length < maxLength;
};

UserSchema.statics.findByEmail = function(email) {
  return this.findOne({email});
};

UserSchema.methods.isUnique = async function() {
  const user = await this.constructor.findByEmail(this.email);
  return user === null;
};

export default UserSchema;
