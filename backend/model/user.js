const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  firstName: {type: String, required: true },
  lastName: {type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true, default: false},
});

userSchema.plugin(uniqueValidator);

/**
* Password hash middleware.
*/
userSchema.pre('save', function save(next) {
  const user = this;
  const SALT_FACTOR =  10;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
