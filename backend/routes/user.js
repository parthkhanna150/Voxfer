const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user')

router.post('/signup', UserController.createUser);

router.get('/confirmation/:token', UserController.authenticateUser);

router.post('/login', UserController.userLogin);

router.post('/reset', UserController.resetPassword);

module.exports = router;
