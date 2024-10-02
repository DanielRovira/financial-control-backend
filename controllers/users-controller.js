const User = require('../models/User');

const getUsersList = async (req, res, next) => {
    const userId =  req.user.id;
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
    // console.log(req.params.id)
    try {
        const post = await User.findByIdAndUpdate(req.params.id , req.body)
        await post.save();
        res.send(req.body);
    } catch {
		res.status(404)
	}
}

module.exports = { getUsersList, patchUserData }