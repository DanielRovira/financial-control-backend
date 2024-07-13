const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin } = require('../controllers/auth-controller');

var ensureLoggedIn = ensureLogIn();

const authenticated = (req, res, next)=>{
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

router.post('/signup', signup);
router.post('/login', login);
router.post('/tokenLogin', verifyToken, refreshToken, getUser);
router.get('/refreshtoken', verifyToken, refreshToken, getUser);
router.get('/oauthLogin', authenticated, oauthLogin); //gera o cookie e redireciona pro front
router.get('/getUser', verifyToken, getUser); //no front o parametro chega mas o cookie não funciona
router.post('/logout', verifyToken, logout);

module.exports = router;

