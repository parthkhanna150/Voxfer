const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'THIS_is_THE_secret_should_BE_lonGeR');
    next();
  } catch(err) {
    res.status(401).json({ message: "Auth failed!"});
  }
};
