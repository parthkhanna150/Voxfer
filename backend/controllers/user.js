const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/user');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

function logError(res, errorCode, error) {
  console.log(error);
  return res.status(errorCode).json({ message: error });
}

exports.createUser = (req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    active: false
  });

  user.save().then(newUser => {
    console.log('Sucessfully created new user.');
    jwt.sign({
      userId: newUser.id,
    },
      process.env.ACTIVATION_SECRET,
      {
        expiresIn: '30d',
      },
      (err, emailToken) => {
        if (err) { return logError(res, 500, 'Error sending activation email.'); };
        let mailOptions = {
          to: process.env.ADMIN_EMAIL,
          subject: 'Approve New User',
          text: `A new user wants to join SPU!\n\n
                Please click on the following link, or paste this into your browser to complete the account activation process:\n\n
                ${process.env.BACKEND_URL}/api/user/activate/${emailToken}\n\n`
        };
        transporter.sendMail(mailOptions).then(() => {
          console.log(`The account has been submitted for review.`);
          delete newUser.password;
          res.status(201).json({
            message: 'User created!',
            result: newUser
          });
        }).catch(err => { return logError(res, 500, 'Error sending activation email.'); });
      },
    );
  }).catch(err => {
    console.log(err.message || err);
    return res.status(500).json({
      // If user already exists, send that as an error. Otherwise, send a generic error.
      message: (err.name === 'ValidationError') ? 'Account with that email address already exists.' : 'Unknown error occured.'
    });
  })
}

exports.activateUser = (req, res, next) => {
  jwt.verify(req.params.token, process.env.ACTIVATION_SECRET, (err, decoded) => {
    if (err) { return logError(res, 500, 'Could not validate token.'); }
    User.findById(decoded.userId).then(user => {
      user.active = true;
      user.save().then(() => {
        console.log('User has been activated.');
        let mailOptions = {
          to: user.email,
          subject: 'Account activated!',
          text: `Your account on SPU has been activated and is ready to use.\n\n Login: ${process.env.FRONTEND_URL}/login`
        };
        transporter.sendMail(mailOptions).then(() => {
          console.log('User has been notified of account activation.');
          // TODO: Generate an HTML page displaying the activation, wait for 2 seconds, then redirect.
          return res.redirect(process.env.FRONTEND_URL + '/');
        }).catch(err => { return logError(res, 500, 'Failed to send account activation notification email to user.'); });
      })
    }).catch(err => { return logError(res, 500, 'Could not find user.'); });
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
        { expiresIn: '1h' },
        (err, token) => {
          if(err) { throw('Login failed!'); }
          return res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
          });
        }
      );
    })
    .catch(err => {
      return res.status(401).json({
        message: err
      });
    });
};
