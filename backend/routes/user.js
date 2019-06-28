const express = require('express');
const { promisify } = require('util');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/User');
const randomBytesAsync = promisify(crypto.randomBytes);

const sendEmail = (mailOptions, success, failure) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log('info', success);
    })
    .catch((err) => {
      return res.status(500).json({ error: failure });
    });
};

router.post('/signup', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      console.log('Email already exists.');
      return res.status(500).json({
        error: 'Account with that email address already exists.'
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
      jwt.sign({
          userId: newUser.id,
        },
        process.env.ACTIVATION_SECRET,
        {
          expiresIn: '30d',
        },
        (err, emailToken) => {
          if(err){ return res.status(500).send('Error sending activation email.'); }
          const mailOptions = {
            to: 'shaurya12345678@gmail.com',
            from: process.env.EMAIL_USER,
            subject: 'Approve New User',
            text: `A new user has joined the website!\n\n
                Please click on the following link, or paste this into your browser to complete the account activation process:\n\n
                http://${process.env.BACKEND_URI}/api/user/activate/${emailToken}\n\n`
          };
          const success = `The account has been submitted for review.`;
          const failure = 'Could not send activation email';
          sendEmail(mailOptions, success, failure).then(() => {
            delete newUser.password;
            res.status(201).json({
              message: 'User created!',
              result: newUser
            });
          });
        },
      );
    });
  });
});

router.get('/activate/:token', (req, res, next) => {
  const id = jwt.verify(req.params.token, process.env.ACTIVATION_SECRET).userId;
  User.findById(id).then(user => {
    user.active = true;
    user.save().then(() => {
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Account activated!',
        text: `Your account on SPU has been activated and is ready to use.\n\n`
      };
      const success = 'User has been notified of account activation.';
      const failure = 'Failed to send account activation notification email to user.';
      sendEmail(mailOptions, success, failure).then(() => {
        return res.status(201).json({ message: 'User has been activated!' });
      });
    })
  }).catch(err => { return res.status(500).json('Could not activate user!'); });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        throw ('Could not find user!');
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        throw ('Incorrect username or password.');
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: err
      });
    });
});

router.post('/reset', (req, res, next) => {
  // this will send an email to this user with a link
  const createRandomToken = randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.status(500).json({ error: 'Account with that email address does not exist.' });
          console.log('Email does not exist.');
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });
  createRandomToken
    .then(setRandomToken)
    .then((user) => {
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Reset your password on SPU',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${process.env.FRONTEND_URI}/reset/${user.passwordResetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      const success = `An e-mail has been sent to ${user.email} with further instructions.`;
      const failure = 'Could not send forgot password email.';
      sendEmail(mailOptions, success, failure)
    })
    .catch(next);
  return res.status(201).json({
    message: 'Reset Successful!'
  });
});

router.get('/reset/:token', (req, res, next) => {
  // Redirect user back to home page if already logged in
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return res.status(500).json({ error: err }); }
      if (!user) {
        console.log('Password reset token is invalid or has expired.');
        return res.status(500).json({ error: 'Password reset token is invalid or has expired.' });
      }
      return res.status(200).json({ message: 'Reset link is valid!' });
    });
});

module.exports = router;
