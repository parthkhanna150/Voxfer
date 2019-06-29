const express = require('express');
const { promisify } = require('util');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/User');

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
          if (err) { return res.status(500).send('Error sending activation email.'); }
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

// POST request from Angular with the email to reset the password for.
router.post('/reset', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      console.log('Password Reset: Email does not exist.');
      return res.status(500).json({ error: 'Account with that email address does not exist.' });
    } else {
      const secret = user.password + '-' + user.createdAt;
      jwt.sign({}, secret,
        {
          expiresIn: '1d',
        },
        (err, emailToken) => {
          if (err) { throw ('Error sending reset password email.'); }
          const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Reset your password on SPU',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${process.env.BACKEND_URI}/api/reset/${user._id}/${emailToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
          };
          const success = `An e-mail has been sent to ${user.email} with further instructions.`;
          const failure = 'Could not send forgot password email.';
          sendEmail(mailOptions, success, failure);
        },
      );
    }
  }).catch(err => { return res.status(500).send(err); });
  return res.status(200).json({
    message: 'Reset email sent!'
  });
});

router.get('/reset/:userId/:token', (req, res, next) => {
  User
    .findById(req.params.userId)
    .exec((err, user) => {
      if (err) { throw(err); }
      if (!user) {
        console.log('Password reset token is invalid or has expired.');
        throw('Password reset token is invalid or has expired.');
      }
      let token;
      try { 
        token = jwt.verify(req.params.token, user.password + '-' + user.createdAt); 
      } catch(err) { 
        throw('Password reset token is invalid or has expired.');
      }
      if (Date.now() >= token.expiresIn * 1000) {
        throw('Password reset token is invalid or has expired.');
      }
      // If the token is valid, redirect to the frontend (password + confirm password form)
      return res.redirect(`http://${process.env.FRONTEND_URI}/reset/${user._id}/${token}`);
    }).catch(err => { 
      // Todo: Redirect to some error page on Angular instead of sending a response.
      return res.status(500).json({ error: err });
    });
});

// POST request from Angular with the new password.
router.post('/reset/:userId/:token', (req, res, next) => {
  User
    .findById(req.params.userId)
    .exec((err, user) => {
      if (err) { throw(err); }
      if (!user) {
        console.log('Password reset token is invalid or has expired.');
        throw('Password reset token is invalid or has expired.');
      }
      let token;
      try { 
        token = jwt.verify(req.params.token, user.password + '-' + user.createdAt);
      } catch(err) { 
        throw('Password reset token is invalid or has expired.');
      }
      if (Date.now() >= token.expiresIn * 1000) {
        throw('Password reset token is invalid or has expired.');
      }
      // If the token is valid, change the password.
      user.password = req.body.password;
      user.save(() => {
        const mailOptions = {
          to: user.email,
          from: process.env.EMAIL_USER,
          subject: 'Your SPU password has been changed',
          text: `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
        };
        const success = `The user ${user.email} has been notified of the password change.`;
        const failure = 'Could not notify the user of the password change.';
        sendEmail(mailOptions, success, failure);
      });
      return res.status(201).json({ message: 'Password successfully changed!'});
    }).catch(err => { 
      return res.status(500).json({ error: err })
    });
})

module.exports = router;
