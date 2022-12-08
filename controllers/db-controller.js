const Financial = require("../models/Financial")

const listData = async (req, res) => {
    try {
        const post = await Financial.find()
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const addData = async (req, res) => {
    try {
        const post = new Financial(req.body)
        await post.save();
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const patchData = async (req, res) => {
    try {
        const post = await Financial.findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
      } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    try {
        await Financial.findByIdAndRemove(req.body._id)
        res.status(204).send()
      } catch {
		res.status(404)
	}
}

module.exports = { addData, listData, patchData, deleteData }

// exports.addData = addData;
// exports.listData = listData;