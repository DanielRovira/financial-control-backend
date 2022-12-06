const express = require("express")
const Financial = require("../models/Financial")
const router = express.Router()

// Get all posts
router.get("/list", async (req, res) => {
	const posts = await Financial.find()
	res.send(posts)
})
router.post("/add", async (req, res) => {
	const post = new Financial(req.body)
	try {
        await post.save();
        res.send(post);
      } catch (error) {
        res.status(500).send(error);
      }
})

module.exports = router
