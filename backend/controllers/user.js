const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/user');
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
      console.log(success);
    })
    .catch((err) => {
      console.log(failure);
      return res.status(500).json({ error: failure });
    });
};

exports.createUser = (req, res, next) => {
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
          error: 'Signup failed'
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
          if (err) { console.log(err); return res.status(500).send('Error sending activation email.'); }
          const mailOptions = {
            to: process.env.ADMIN_EMAIL,
            from: process.env.EMAIL_USER,
            subject: 'Approve New User',
            text: `A new user wants to join SPU!\n\n
                Please click on the following link, or paste this into your browser to complete the account activation process:\n\n
                ${process.env.BACKEND_URL}/api/user/activate/${emailToken}\n\n`
          };
          const success = `The account has been submitted for review.`;
          const failure = 'Error sending activation email.';
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
}

exports.activateUser = (req, res, next) => {
  jwt.verify(req.params.token, process.env.ACTIVATION_SECRET, (err, decoded) => {
    if (err) { return res.status(500).json({ error: 'Could not validate token.' }); }
    User.findById(decoded.userId, (err, user) => {
      if (err) { return res.status(500).json({ error: 'Could not activate user!' }); }
      user.active = true;
      user.save().then(() => {
        const mailOptions = {
          to: user.email,
          from: process.env.EMAIL_USER,
          subject: 'Account activated!',
          text: `Your account on SPU has been activated and is ready to use.\n\n Login <a href="${process.env.FRONTEND_URL}/login"> here</a>`
        };
        const success = 'User has been notified of account activation.';
        const failure = 'Failed to send account activation notification email to user.';
        sendEmail(mailOptions, success, failure).then(() => {
          console.log('User has been activated.');
          // Generate an HTML page displaying the activation, wait fo 2 seconds, then redirect.
          return res.redirect(process.env.FRONTEND_URL + '/');
        });
      })
    })
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user || !user.active) {
        throw ('Login failed!');
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
        message: 'Login failed!'
      });
    });
};
