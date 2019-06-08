const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: { name: String, required: true },
});

module.exports = mongoose.model('Category', categorySchema);
// collection name would be posts: lowercase(modelName)+'s'
