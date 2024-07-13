const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var datetime = new Date(new Date()-3600*1000*3).toISOString();  //GMT -3

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        // console.log(err);
    }
    if (existingUser) {
        return res
            .status(400)
            .json({ message: "User already exists! Login Instead" });
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
    } catch (err) {
        // console.log(err);
    }
    return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return new Error(err);
    }
    if (!existingUser) {
        return res.status(400).json({ message: "User not found. Signup Please", status: 400 });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Inavlid Email / Password", status: 400 });
    }
    const token = jwt.sign({ id: existingUser._id, name: existingUser.name }, process.env.JWT_SECRET_KEY, {
        expiresIn: `${process.env.EXP_TIME}s`,
    });
  
    // console.log("Login sucessfull\n", `User: ${existingUser.name}\n`, datetime);
  
    // if (req.cookies[`${existingUser._id}`]) {
    //     req.cookies[`${existingUser._id}`] = "";
    // }
    if (req.cookies["token"]) {
        req.cookies["token"] = "";
    }
  
    // res.cookie(String(existingUser._id), token
    res.cookie("token", token
    , {
        path: "/",
        expires: new Date(Date.now() + 1000 * process.env.EXP_TIME), // seconds
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }
    );
  
    return res
        .status(200)
        .json({ message: "Successfully Logged In", user: {name: existingUser.name, email: existingUser.email}, token, status: 200 });
};

const verifyToken = (req, res, next) => {
    // console.log(req)
    console.log("verifyToken")
    console.log(req.cookies)
    // console.log(req.headers)
    console.log(req.cookie)
    console.log(req.session)

    // const cookies = req.headers.cookie?.split(";")[(req.headers.cookie?.split(";").length)-1];
    if (req.cookies["token"]) {
        // const token = cookies?.split("=")[1];
        const token = req.cookies["token"];
        if (!token) {
            res.status(404).json({ message: "No token found", status: 404 });
        }
        jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(400).json({ message: "Invalid Token", status: 400 });
            }
            // console.log(`Requisition by user: ${user.name}\n`, datetime);
            req.id = user.id;
            next();
        })}
    else {return res.status(405).json({ message: "Couldn't find token", status: 405 })}
};

const getUser = async (req, res, next) => {
    const userId = req.id ||  req.user.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not Found" });
    }

    // return res.status(200).json({ user });
    return res
    .status(200)
    .json({ user: {name: user.name, email: user.email}, status: 200 });
};

const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie?.split(";")[(req.headers.cookie?.split(";").length)-1];

    if (cookies) {
        const prevToken = cookies.split("=")[1];
        if (!prevToken) {
            return res.status(400).json({ message: "Couldn't find token" });
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                // console.log(err);
                return res.status(403).json({ message: "Authentication failed" });
            }
            // res.clearCookie(`${user.id}`);
            // req.cookies[`${user.id}`] = "";
            res.clearCookie("token");
            req.cookies["token"] = "";

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "3005s",
            });
            // console.log("Regenerated Token\n", `User: ${user.name}\n`, datetime);

            // res.cookie(String(user.id), token, {
            res.cookie("token", token, {
                path: "/",
                expires: new Date(Date.now() + 1000 * process.env.EXP_TIME), // seconds
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });

            req.id = user.id;
            next();
        })
    }
    else {return res.status(400).json({ message: "Couldn't find token" })}
};

const logout = (req, res, next) => {
    const cookies = req.headers.cookie?.split(";")[(req.headers.cookie?.split(";").length)-1];

    if (cookies) {
        const prevToken = cookies.split("=")[1];
        if (!prevToken) {
            return res.status(400).json({ message: "Couldn't find token" });
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
            // console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
            }
            // res.clearCookie(`${user.id}`);
            // req.cookies[`${user.id}`] = "";
            res.clearCookie("token");
            res.clearCookie("connect.sid");
            req.cookies["token"] = "";
            req.cookies["connect.sid"] = "";
            req.session.destroy()
            // console.log("Logout sucessfull\n", `User: ${user.name}\n`, datetime);
            return res.status(200).json({ message: "Successfully Logged Out" });
        });
    }
    else {return res.status(400).json({ message: "Couldn't find token" });}
};

exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
