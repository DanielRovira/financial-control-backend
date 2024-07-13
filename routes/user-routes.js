const express = require('express');
const router = express.Router();
// const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { signup, login, verifyToken, getUser, refreshToken, logout } = require('../controllers/user-controller');
const { oauthLogin } = require('../controllers/auth-controller');

// var ensureLoggedIn = ensureLogIn();

const authenticated = (req, res, next)=>{
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

const test = (req, res, next)=>{
    console.log("<<<<<<<<<<<< TEST >>>>>>>>>>>>")
    console.log("req.user:")
    console.log(req.user)
    console.log("req.body.user:")
    console.log(req.body.user)
    console.log("req.cookies:")
    console.log(req.cookies)
        next()
}

router.post('/signup', signup);
router.post('/login', login);
router.get('/refreshtoken', verifyToken, refreshToken, getUser);
router.post('/logout', verifyToken, logout);

// google redireciona de volta pra essa rota, que no final manda pro front
router.get('/oauthLogin', test, authenticated, oauthLogin); //gera o cookie e redireciona pro front

// front executa essas duas rotas em sequencia, pq só o a rota getuser não deixa um cookie do front
router.get('/getUser', test, verifyToken, getUser); //no front o parametro chega mas o cookie não funciona
router.post('/tokenLogin', test, verifyToken, refreshToken, getUser); //entao o front pega o token que recebeu de getUser e posta um login, recebendo um novo token pro Domain do front

module.exports = router;

