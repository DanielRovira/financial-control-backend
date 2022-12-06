const Financial = require("../models/Financial")

// const checkBody = (req,res,next) => {
//     if ("_id" in req.body) {
//         req.body._id = ObjectId(req.body._id)
//     }
//     next()
// }

const listData = async (req, res) => {
	const post = await Financial.find()
	try {
        res.send(post);
      } catch (error) {
        res.status(500).send(error);
      }
}

const addData = async (req, res) => {
	const post = new Financial(req.body)
	try {
        await post.save();
        res.send(post);
      } catch (error) {
        res.status(500).send(error);
      }
}

const patchData = async (req, res) => {
    
    try {
        const post = await Financial.findOne({ _id: req.body.id })
        if (req.body.desc) {
			post.desc = req.body.desc
		}
        await post.save();
        res.send(post.body);
      } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
}

module.exports = { addData, listData, patchData }

// exports.addData = addData;
// exports.listData = listData;