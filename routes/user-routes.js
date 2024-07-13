const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin } = require('../controllers/auth-controller');

var ensureLoggedIn = ensureLogIn();

const authenticated = (req, res, next)=>{
    console.log("authenticated midware")
    // console.log(req.user)
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

// const redirect = (req, res, next)=>{
//     var token = req.token
//     return res.redirect(`${process.env.CORS}/api/login?token=` + token) //redirect to login.get on front end domain
// }
// const sendUser = (req, res, next)=>{
//     return res
//     .status(200)
//     .json({ message: "Successfully Logged In", user: {name: req.user.name, email: req.user.email}, status: 200 });
// }

router.post('/signup', signup);
router.post('/login', login);
// router.get('/login', (req, res, next) => {    if (req.query.token) {
//     let token = req.query.token
//     jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(400).json({ message: "Invalid Token", status: 400 });
//         }
//         // console.log(`Requisition by user: ${user.name}\n`, datetime);
//         req.user.id = user.id;
//         req.token = token
//         next();
//     })
// }}, oauthLogin, sendUser);
router.post('/tokenLogin', verifyToken, refreshToken, getUser);
router.get('/refreshtoken', verifyToken, refreshToken, getUser);
// router.get('/refreshtoken', (req, res, next) => {return res.status(200)});
router.get('/oauthLogin', authenticated, oauthLogin); //gera o cookie e redireciona pro front
router.get('/getUser', verifyToken, getUser); //consegue passar o parametro mas não o cookie?
// router.get('/oauthLogin', (req,res,next) => console.log(req));
router.post('/logout', verifyToken, logout);

module.exports = router;

