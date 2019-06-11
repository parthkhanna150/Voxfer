const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const Article = require('./model/article');

const api_key = require('../app_env');

mongoose.connect("mongodb+srv://Parth:"+api_key+"@cluster0-cneed.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
  next();
});

// TODO: remove IDs from interface, OR they'll be OVERWRITTEN ???
app.get('/api/articles',(req, res, next) => {
  Article.find().then(documents => {
    res.status(200).json({
      message: 'Articles fetched successfully',
      articles: documents
    });
  });
});

app.get('/api/articles/:id',(req, res, next) => {
  // Article.findOne(req.params.id)
  //   .then(document => {
  //     res.status(200).json({
  //       message: 'Article fetched successfully',
  //       article: document
  //   });
  // });
});

app.post('/api/articles/create', (req, res, next) => {
  const article = new Article({
    authors: req.body.authors,
    title: req.body.title,
    content: req.body.content,
    categories: req.body.categories
  });
  article.save();
  // console.log(article);
  res.status(201).json({
    message: 'Article added successfully!'
  });
});

// app.get("/api/articles/:id", (req, res, next) => {
//   Post.find({_id: req.params.id})
//     .then((result) => console.log(result));
//   res.status(200).json({ message: "Article fetched successfully!"});
// });

module.exports = app;
