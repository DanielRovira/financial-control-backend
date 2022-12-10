const routes = require("../models/Financial")

const listData = async (req, res) => {
    try {
        const post = await routes[req.params.id].find()
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const addData = async (req, res) => {
    try {
        const post = new routes[req.params.id](req.body)
        await post.save();
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const patchData = async (req, res) => {
    try {
        const post = await routes[req.params.id].findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
      } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    try {
        await routes[req.params.id].findByIdAndRemove(req.body._id)
        res.status(204).send()
      } catch {
		res.status(404)
	}
}

module.exports = { addData, listData, patchData, deleteData }

// exports.addData = addData;
// exports.listData = listData;