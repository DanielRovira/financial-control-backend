const User = require('../models/User');

const isAdminAuthenticated = (req, res, next)=>{
    if (req.user) {
        if (req.user.id === process.env.DEFAULT_USER_DB) {
            next()
        }
        else {return res.status(400).json({ message: "User is not Admin", status: 400 })}
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

const getUsersList = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password -__v");
    } catch (err) {
        return new Error(err);
    }
    if (!users) {
        return res.status(404).json({ messsage: "Users Not Found" });
    }

    return res
    .status(200)
    .json({ users: users, status: 200 });
};

const patchUserData = async (req, res) => {
    try {
        const post = await User.findByIdAndUpdate(req.params.id , req.body)
        await post.save();
        res.send(req.body);
    } catch {
		res.status(404)
	}
}

module.exports = { isAdminAuthenticated, getUsersList, patchUserData }