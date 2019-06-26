const express = require('express');
const router = express.Router();
const Article = require('../model/article');
const checkAuth = require('../middleware/check-auth');

router.get('', (req, res, next) => {
  Article.find().then(documents => {
    res.status(200).json({
      message: 'Articles fetched successfully',
      articles: documents
    });
  });
});

router.post('', checkAuth, (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    categories: req.body.categories
  });
  article.save();
  res.status(201).json({
    message: 'Article added successfully!'
  });
});

router.put('/:id', checkAuth, (res, req, next) => {
  const article = new Article({
    _id: req.req.body.id,
    title: req.req.body.title,
    content: req.req.body.content,
    categories: req.req.body.categories
  });
  Article.updateOne({_id: req.req.params.id}, article)
    .then(result => {
      res.res.status(200).json({ message: "Update successful!" });
    });
});

router.get("/:id", (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if(article){
        // console.log(article);
        res.status(200).json({article: article});
      } else {
        res.status(404).json({ message: 'Page not found!' });
      }
    });
});

module.exports = router;
