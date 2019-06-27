const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: Boolean,
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
// collection name would be posts: lowercase(modelName)+'s'
