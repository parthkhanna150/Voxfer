const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// mongoose.connect('mongodb+srv://Parth:kZK95wmYkYJMcdH0@cluster0-cneed.mongodb.net/test?retryWrites=true&w=majority')
//   .then(() => {
//     console.log('connected to database');
//   })
//   .catch(() => {
//     console.log('connection failed');
//   });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
  next();
});

// app.post("/api/articles", (req, res, next) => {
//   console.log
  // const article = new Article({
  //   authors: ['test','test'],
  //   title: req.body.title,
  //   content: req.body.content,
  //   categories:  ['test','test']
  // });

  // article.save()
  //   .then((createdPost) => {
  //     res.status(201).json({
  //       message: 'Article Added Successfully',
  //       postId: createdPost._id
  //     });
  //   });
// });

// TODO: remove IDs from interface, OR they'll be OVERWRITTEN ???
app.get('/api/articles',(req, res, next) => {
  const articles = [
    {
      id: 'hshdhs',
      authors: ['a1','a2'],
      title: 'title 1',
      content: 'content here 1',
      categories: ['c1', 'c2']
    },
    {
      id: 'ereswdfs',
      authors: ['au1','au2'],
      title: 'title 2',
      content: 'content here 2',
      categories: ['c21', 'c22']
    }
  ];
  res.status(200).json({
    message: 'Articles fetched successfully',
    articles: articles
  });
  // Post.find().then(documents => {
  //   res.status(200).json({
  //     message: 'articles fetched successfully',
  //     articles: documents
  //   });
  // });
});

// app.get("/api/articles/:id", (req, res, next) => {
//   Post.find({_id: req.params.id})
//     .then((result) => console.log(result));
//   res.status(200).json({ message: "Article fetched successfully!"});
// });

module.exports = app;
