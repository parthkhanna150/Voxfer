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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
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

app.post('/api/articles/create', (req, res, next) => {
  const article = new Article({
    authors: req.body.authors,
    title: req.body.title,
    content: req.body.content,
    categories: req.body.categories
  });
  article.save();
  res.status(201).json({
    message: 'Article added successfully!'
  });
});

app.put('/api/articles/:id', (res, req, next) => {
  // console.log(typeof req);
  // var iterator = (Object.keys(req.req)).values();
  // for (let elements of iterator) {
  //   console.log(elements);
  // }
  const article = new Article({
    _id: req.req.body.id,
    authors: req.req.body.authors,
    title: req.req.body.title,
    content: req.req.body.content,
    categories: req.req.body.categories
  });
  // console.log(article);
  Article.updateOne({_id: req.req.params.id}, article)
    .then(result => {
      res.res.status(200).json({ message: "Update successful!" });
    });
});

app.get("/api/articles/:id", (req, res, next) => {
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

module.exports = app;
