const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const financialSchema = new Schema({
	date: String,
    expense: Boolean,
    source: String,
    category: String,
    subCategory: String,
	link: String,
	bank: String,
	idnumber: String,
    provider: String,
	desc: String,
    amount: Number,
    costCenter: String,
    archived: Boolean,

    name: String,
    title: String,
    type: String,
},
{
    versionKey: false // You should be aware of the outcome after set to false
}
)

const sectionslSchema = new Schema({
    name: String,
    title: String,
    type: String,
})

const listData = async (req, res) => {
    try {
        const post = await mongoose.model(req.params.id, financialSchema, req.params.id).find()
        res.send({post, status: 200});
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

const listCategories = async (req, res) => {
    try {
        const post = await mongoose.model("Categories", sectionslSchema, "categories").find()
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

module.exports = { listData, listSections, listCategories, addData, patchData, deleteData }
