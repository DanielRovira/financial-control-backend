const express = require('express');
const router = express.Router();
const { signup, getUser } = require('../controllers/user-controller');
const { isAuthenticated, logout } = require('../controllers/auth-controller');

router.post('/signup', signup);
router.get('/refreshtoken', isAuthenticated, getUser);
router.post('/logout', isAuthenticated, logout);
router.get('/getUser', isAuthenticated, getUser);

module.exports = router;
