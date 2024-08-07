const mongoose = require("mongoose")
const { financialSchema, Section, Category } = require('../models/Finance');

const listData = async (req, res) => {
    const collection = req.params.id
    try {
        const post = await mongoose.model(collection, financialSchema, collection).find()
        res.send({post, status: 200});
    } catch (error) {
        res.status(500);
    }
}

const listSections = async (req, res) => {
    try {
        const post = await Section.find()
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const listCategories = async (req, res) => {
    try {
        const post = await Category.find()
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const addData = async (req, res) => {
    const collection = req.params.id
    try {
        const post = new mongoose.model(collection, financialSchema, collection)(req.body)
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const patchData = async (req, res) => {
    const collection = req.params.id
    try {
        const post = await mongoose.model(collection, financialSchema, collection).findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
    } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    const collection = req.params.id
    try {
        await mongoose.model(collection, financialSchema, collection).findByIdAndRemove(req.body._id)
        res.status(204).send()
    } catch {
		res.status(404)
	}
}

const checkBody = (req,res,next) => {
    if ('_id' in req.body) {
        req.body._id = mongoose.Types.ObjectId(req.body._id)
    }
    next()
}

const checkCollection = async (req,res,next) => {
    const sheetTypeSet = ["financialControl", "todoPayments"];
    let collection = req.params.id.split("-")[0]
    let sheetType = req.params.id.split("-")[1]
    let post
    try {
        post = await Section.findOne({ title: collection })
    } catch (error) {
        return new Error(err);
    }
    if (post && sheetTypeSet.includes(sheetType)) {
        next()
    }
    else {
        return res.status(400).json({ message: "Couldn't find section" })
    }
}

module.exports = { listData, listSections, listCategories, addData, patchData, deleteData, checkBody, checkCollection }
