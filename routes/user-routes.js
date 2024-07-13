const express = require('express');
const router = express.Router();
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin } = require('../controllers/auth-controller');

var ensureLoggedIn = ensureLogIn();

const authenticated = (req, res, next)=>{
    console.log("authenticated midware")
    console.log(req.user)
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

router.post('/signup', signup);
router.post('/login', login);
router.get('/getUser', verifyToken, refreshToken, getUser);
// router.get('/refreshtoken', verifyToken, refreshToken, getUser);
router.get('/oauthLogin', authenticated, oauthLogin);
// router.get('/oauthLogin', (req,res,next) => console.log(req));
router.post('/logout', verifyToken, logout);

module.exports = router;

