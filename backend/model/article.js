const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  authors: [{name: {type: String, required: true}, level: {type: String, required: true}}],
  title:
  {
    type: String,
    required: true
  },
  content:
  {
    type: String,
    required: true
  },
  categories: [{type: String, required: true}]
});

module.exports = mongoose.model('Article', articleSchema);
// collection name would be articles: lowercase(modelName)+'s'
