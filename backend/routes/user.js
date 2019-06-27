const express = require('express');
const { promisify } = require('util');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/User');

//const randomBytesAsync = promisify(crypto.randomBytes);
router.post('/signup', (req, res, next) => {
  const sendSignupEmail = (user) => {
    if (!user) { return; }
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const mailOptions = {
      to: 'shaurya12345678@gmail.com',
      from: process.env.EMAIL_USER,
      subject: 'Approve User',
      text: `A new user has joined the website!\n\n
        Please click on the following link, or paste this into your browser to complete the account activation process:\n\n
        http://${process.env.FRONTEND_URI}/activate/${user._id}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        console.log('info', `An e-mail has been sent to ${user.email} with further instructions.`);
      })
      .catch((err) => {
        console.log('ERROR: Could not send activation email.\n', err);
        console.log('errors', 'Error sending the password reset message. Please try again shortly.');
        return res.status(500).json({ error: "COuld not send activation email." });
      });
  };

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      console.log('Email already exists.');
      return res.status(500).json({
        error: 'Account with that email address already exists. Redirecting to Signup...'
      });
    }
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      active: false
    });

    user.save((err, newUser) => {
      if (err) {
        console.log('error', err);
        return res.status(500).json({
          error: err
        });
      }
      console.log('Sucessfully registered');
      sendSignupEmail(newUser).then(() => {
        delete newUser.password;
        res.status(201).json({
          message: 'User created!',
          result: newUser
        });
      });
    });
  });
});

router.get('/activate/:userId', (req, res, next) => {
  
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
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
          message: 'Auth failed'
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      });
    });
});

router.post('/reset', (req, res, next) => {
  // this will send an email to this user with a link
  console.log(req.body.email);
  res.status(201).json({
    message: 'Reset!'
  });
});

module.exports = router;
