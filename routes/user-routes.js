const express = require('express');
const router = express.Router();
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin, findSession } = require('../controllers/auth-controller');

var ensureLoggedIn = ensureLogIn();

// function callback(req, res, next) {return res.redirect(process.env.CORS)}
const authenticated = (req, res, next)=>{
    console.log(req.user)
    // const customError = new Error('you are not logged in');
    // customError.statusCode = 401;
    // (!req.user) ? next(customError) : next()
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

// router.get('/getUser', authenticated, (req, res) => {
//     console.log("getUser:")
//     console.log(req.user)
//     // res.session.context = { user: {name: req.user.name, email: req.user.email}, status: 200 }
//     // res.redirect(`${process.env.CORS}`)
// })
// router.post('/findsession', findSession);


router.post('/signup', signup);
router.post('/login', login);
router.get('/getUser', verifyToken, getUser);
router.get('/refreshtoken', refreshToken, verifyToken, getUser);
router.get('/oauthLogin', authenticated, oauthLogin);
// router.get('/oauthLogin', (req,res,next) => console.log(req));
router.post('/logout', verifyToken, logout);

module.exports = router;

