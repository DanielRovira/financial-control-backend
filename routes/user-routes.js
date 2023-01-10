const express = require('express');
const router = express.Router();
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');

// router.post('/signup', signup);
router.post('/login', login);
// router.get('/user', verifyToken, getUser);
router.get('/refresh', refreshToken, verifyToken, getUser);
router.post('/logout', verifyToken, logout);

module.exports = router;

