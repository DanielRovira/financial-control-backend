const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const oauthLogin = async (req, res, next) => {
    console.log(req.user)
    console.log(req.session.passport.user)
    const userId = req.user.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not Found" });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET_KEY, {
        expiresIn: `${process.env.EXP_TIME}s`,
    });

    if (req.cookies["token"]) {
        req.cookies["token"] = "";
    }

    res.cookie("token", token
        , {
            path: "/",
            expires: new Date(Date.now() + 1000 * process.env.EXP_TIME), // seconds
            httpOnly: true,
            sameSite: "lax",
        }
        );
        
        return res.redirect(process.env.CORS)
        // return res
        // .status(200)
        // .json({ message: "Successfully Logged In", user: {name: user.name, email: user.email}, token, status: 200 });
};

exports.oauthLogin = oauthLogin;