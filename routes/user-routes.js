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

const redirect = (req, res, next)=>{
    return res.redirect(`${process.env.CORS}`)
}

router.post('/signup', signup);
router.post('/login', login);
// router.get('/refreshtoken', verifyToken, refreshToken, getUser);
router.get('/refreshtoken', (req, res, next) => {return res.status(200)});
router.get('/oauthLogin', authenticated, oauthLogin, redirect); //gera o cookie e redireciona pro front
router.get('/getUser', verifyToken, getUser); //consegue passar o parametro mas não o cookie?
// router.get('/oauthLogin', (req,res,next) => console.log(req));
router.post('/logout', verifyToken, logout);

module.exports = router;

