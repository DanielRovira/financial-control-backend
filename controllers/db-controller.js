const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const financialSchema = new Schema({
	date: String,
	desc: String,
    amount: Number,
    expense: Boolean,
    prov: String,
    forn: String
})

const sectionslSchema = new Schema({
    date: String
})

const listData = async (req, res) => {
    try {
        const post = await mongoose.model(req.params.id, financialSchema, req.params.id).find()
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const listSections = async (req, res) => {
    try {
        const post = await mongoose.model("Sections", sectionslSchema, "sections").find()
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const addData = async (req, res) => {
    try {
        const post = new mongoose.model(req.params.id, financialSchema, req.params.id)(req.body)
        await post.save();
        res.send(post);
      } catch (error) {
        res.status(500);
      }
}

const patchData = async (req, res) => {
    try {
        const post = await mongoose.model(req.params.id, financialSchema, req.params.id).findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
      } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    try {
        await mongoose.model(req.params.id, financialSchema, req.params.id).findByIdAndRemove(req.body._id)
        res.status(204).send()
      } catch {
		res.status(404)
	}
}

module.exports = { listData, listSections, addData, patchData, deleteData }

// exports.addData = addData;
// exports.listData = listData;