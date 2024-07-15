const express = require('express');
const router = express.Router();
const { isAuthenticated, logout, getUser, signup } = require('../controllers/auth-controller');
const login = require('./passport-local');
const googleRouter = require('./google-auth');

router.post('/signup', signup);
router.use('/login', login);
router.get('/refreshtoken', isAuthenticated, getUser);
router.post('/logout', isAuthenticated, logout);
router.use('/oauth', googleRouter);

module.exports = router;
