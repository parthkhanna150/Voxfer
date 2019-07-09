const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/user');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'researchwiki1234@gmail.com',
    pass: 'Admin@123'
  }
});

exports.createUser = (req, res, next) => {
  let fetchedUser;
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        active: false
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
          fetchedUser = result;
          try{
            jwt.sign(
              {_id: fetchedUser._id},
              process.env.JWT_KEY,
              {expiresIn: '14d'},
              (err, emailToken) => {
                const url = `http://localhost:3000/api/user/confirmation/${emailToken}`;

                transporter.sendMail({
                  to: 'parth.khanna@mail.mcgill.ca',
                  subject: `Approve access for ${req.body.email}`,
                  html: `Hi Brian, Please click this link to give access i.e.create, delete and edit articles (owned by the user): <a href="${url}">Activate ${req.body.email}</a>`
                });
              },
            );
          } catch(err) {
            console.log(err);
          }
        })
        .catch(err => {
          return res.status(401).json({
            message: 'Sign up failed'
          });
        });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user || !user.active) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        process.env.JWT_KEY,
        {expiresIn: '1h'}
        );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Login failed'
      });
  });
}

exports.authenticateUser = async (req, res, next) => {
  try {
    const id = jwt.verify(req.params.token, process.env.JWT_KEY);
    User.updateOne({_id: id}, {active: true})
      .then(res => {
        User.findById(id)
          .then(result => {
            transporter.sendMail({
              to: `${result.email}`,
              subject: `Approved Access to SPU`,
              html: `Hi ${result.email}, You have been authenticated! Login <a href="http://localhost:4200/login"> here</a>`
            });
          });
    });

  } catch(err) {
    console.log(err);
  }
  return res.redirect('http://localhost:4200/');
}

exports.resetPassword = (req, res, next) => {
  // this will send an email to this user with a link
  console.log(req.body.email);
  res.status(201).json({
    message: 'Reset!'
  });
}
