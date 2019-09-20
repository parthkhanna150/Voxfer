const Article = require("../model/article");

exports.getArticles = (req, res, next) => {
  Article.find({ title: { $regex: req.query.title, $options: "i" } })
    .then(documents => {
      res.status(200).send(documents);
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching articles failed!"
      });
    });
};

exports.addCreator = (req, res, next) => {
  let article;
  Article.findById(req.params.id)
  .then(result => {
    savedCreators = result.creator;
    savedCreators.push(req.body.accessAuthorId);
    article = new Article({
      _id: result.id,
      title: result.title,
      authors: result.authors,
      content: result.content,
      summary: result.summary,
      categories: result.categories,
      creator: savedCreators
    });
    console.log(article.creator);
    Article.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      article
    )
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Access Update successful!" });
        } else {
          res.status(401).json({ message: "Not Authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't update article access rights!"
        });
      });
  });
};

exports.createArticle = (req, res, next) => {
  let savedArticle;
  const article = new Article({
    title: req.body.title,
    authors: req.body.authors,
    content: req.body.content,
    summary: req.body.summary,
    creator: [req.userData.userId],
    categories: req.body.categories
  });
  article
    .save()
    .then(article => {
      savedArticle = article;
      res.status(201).json({
        message: "Article added successfully!",
        article: savedArticle
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a article failed!"
      });
    });
};

exports.updateArticle = (req, res, next) => {
  let savedCreators;
  let article;
  Article.findById(req.body.id).then(result => {
    savedCreators = result.creator;
    article = new Article({
      _id: req.body.id,
      title: req.body.title,
      authors: req.body.authors,
      content: req.body.content,
      summary: req.body.summary,
      categories: req.body.categories,
      creator: savedCreators
    });
    Article.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      article
    )
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not Authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't update article!"
        });
      });
  });
};

exports.getArticleById = (req, res, next) => {
  Article.findById(req.params.id)
    .then(article => {
      if (article) {
        res.status(200).json({ article: article });
      } else {
        res.status(404).json({ message: "Page not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching article failed!"
      });
    });
};

exports.deleteArticle = (req, res, next) => {
  Article.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting article failed!"
      });
    });
};
