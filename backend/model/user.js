const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
// collection name would be posts: lowercase(modelName)+'s'
