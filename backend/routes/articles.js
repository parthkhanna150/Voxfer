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
    creator: req.userData.userId,
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
  Article.updateOne({_id: req.req.params.id, creator: req.req.userData.userId}, article)
    .then(result => {
      if (result.nModified > 0) {
        res.res.status(200).json({ message: "Update successful!" });
      } else {
        res.res.status(401).json({ message: "Not Authorized!" });
      }
    });
});

router.get("/:id", (req, res, next) => {
  Article.findById(req.params.id)
    .then(article => {
      if(article){
        // console.log(article);
        res.status(200).json({article: article});
      } else {
        res.status(404).json({ message: 'Page not found!' });
      }
    });
});

router.delete(':/id', checkAuth, (req, res, next) => {
  Article.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.n > 0) {
        res.res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.res.status(401).json({ message: "Not Authorized!" });
      }
    });
});

module.exports = router;
