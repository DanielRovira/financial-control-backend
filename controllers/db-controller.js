const Financial = require("../models/Financial")

// const checkBody = (req,res,next) => {
//     if ("_id" in req.body) {
//         req.body._id = ObjectId(req.body._id)
//     }
//     next()
// }

const listData = async (req, res) => {
    try {
        const post = await Financial.find()
        res.send(post);
      } catch (error) {
        res.status(500).send(error);
      }
}

const addData = async (req, res) => {
    try {
        const post = new Financial(req.body)
        await post.save();
        res.send(post);
      } catch (error) {
        res.status(500).send(error);
      }
}

const patchData = async (req, res) => {
    try {
        const post = await Financial.findByIdAndUpdate(req.body.id , req.body)
        await post.save();
        res.send(req.body);
      } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
}

const deleteData = async (req, res) => {
    try {
        await Financial.findByIdAndRemove(req.body.id)
        res.status(204).send()
      } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
}

module.exports = { addData, listData, patchData, deleteData }

// exports.addData = addData;
// exports.listData = listData;