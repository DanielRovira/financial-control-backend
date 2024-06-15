const express = require('express');
const router = express.Router();
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin } = require('../controllers/auth-controller');

var ensureLoggedIn = ensureLogIn();

router.post('/signup', signup);
router.post('/login', login);
// router.get('/user', verifyToken, getUser);
router.get('/refreshtoken', refreshToken, verifyToken, getUser);
router.get('/oauthLogin', ensureLoggedIn, oauthLogin);
router.post('/logout', verifyToken, logout);

module.exports = router;

