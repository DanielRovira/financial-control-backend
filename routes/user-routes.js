const express = require('express');
const router = express.Router();
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin, findSession } = require('../controllers/auth-controller');

var ensureLoggedIn = ensureLogIn();

// function callback(req, res, next) {return res.redirect(process.env.CORS)}
const authenticated = (req,res,next)=>{
    console.log(req)
    const customError = new Error('you are not logged in');
    customError.statusCode = 401;
    (!req.user) ? next(customError) : next()
}
router.get('/getUser',authenticated, (req, res)=> res.json({ user: {name: req.user.name, email: req.user.email}, status: 200 }))
// router.post('/findsession', findSession);


router.post('/signup', signup);
router.post('/login', login);
// router.get('/user', verifyToken, getUser);
router.get('/refreshtoken', refreshToken, verifyToken, getUser);
router.get('/oauthLogin', findSession, oauthLogin);
router.post('/logout', verifyToken, logout);

module.exports = router;

