const express = require('express');
const router = express.Router();
const { isAuthenticated, logout, getUser, signup } = require('../controllers/auth-controller');
const login = require('./passport-routes');

router.use('/login', login);
router.post('/signup', signup);
router.post('/logout', isAuthenticated, logout);
router.get('/refreshtoken', isAuthenticated, getUser);

module.exports = router;
