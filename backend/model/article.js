const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  categories: [{type: String, required: true}]
});

module.exports = mongoose.model('Article', articleSchema);
// collection name would be articles: lowercase(modelName)+'s'
