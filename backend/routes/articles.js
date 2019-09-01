const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ArticleController = require('../controllers/articles')

router.get('', ArticleController.getArticles);

router.post('', checkAuth, ArticleController.createArticle);

router.post('/invite/:id', checkAuth, ArticleController.addCreator);

router.put("/:id", checkAuth, ArticleController.updateArticle);

router.get("/:id", ArticleController.getArticleById);

router.delete("/:id", checkAuth, ArticleController.deleteArticle);

module.exports = router;
