const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const articlesRoutes = require('./routes/articles')
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://Parth:"+ process.env.MONGO_ATLAS_PW +"@cluster0-cneed.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
});

app.use('/api/articles/', articlesRoutes);
app.use('/api/user/', userRoutes);

module.exports = app;
