const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  authors: { type: String, value: [String], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  categories: { type: String, value: [String], required: true }
});

module.exports = mongoose.model('Article', articleSchema);
// collection name would be posts: lowercase(modelName)+'s'
