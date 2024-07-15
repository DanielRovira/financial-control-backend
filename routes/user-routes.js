const express = require('express');
const router = express.Router();
const { isAuthenticated, logout, getUser, signup } = require('../controllers/auth-controller');
const login = require('./routes/passport-local');
const googleRouter = require('./routes/google-auth');

router.post('/signup', signup);
router.route("/login", login);
router.get('/getUser', isAuthenticated, getUser);
router.get('/refreshtoken', isAuthenticated, getUser);
router.post('/logout', isAuthenticated, logout);
app.route('/oauth', googleRouter);

module.exports = router;
