const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user')

router.get('', UserController.checkUser);

router.post('/signup', UserController.createUser);

router.get('/activate/:token', UserController.activateUser);

router.post('/login', UserController.userLogin);

module.exports = router;
