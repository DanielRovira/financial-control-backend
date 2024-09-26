const mongoose = require("mongoose")
const { financialSchema, sectionSchema } = require('../models/Finance');

const typeSet = ["sections", "categories"];

const getTenantDb = (user) => {
    const userDatabase = user.database ? user.database : user.id
    const db = mongoose.connection.useDb(userDatabase, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    let collection = req.params.id.split("-")[0]
    let sheetType = req.params.id.split("-")[1]
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-${collection}`, financialSchema, "finances").find({ costCenter: collection , status: sheetType })
        res.send({post, status: 200});
    } catch (error) {
        res.status(500);
    }
}

const listSections = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-sections`, sectionSchema, "sections").find()
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const listCategories = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-categories`, sectionSchema, "categories").find()
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const addData = async (req, res) => {
    const collection = typeSet.includes(req.params.id.split("-")[0]) ? req.params.id : "finances"
    try {
        const post = getTenantDb(req.user).model(`${req.user.id}-${collection}`, financialSchema, collection)
        const add = new post(req.body)
        await add.save();
        res.send(add);
    } catch (error) {
        res.status(500);
    }
}

const patchData = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-${req.params.id}`, financialSchema, "finances").findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
    } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    const collection = typeSet.includes(req.params.id.split("-")[0]) ? req.params.id.split("-")[0] : "finances"
    try {
        await getTenantDb(req.user).model(`${req.user.id}-${req.params.id}`, financialSchema, collection).findByIdAndRemove(req.body._id)
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
    let collection = req.params.id.split("-")[0]
    let post
    try {
        post = await getTenantDb(req.user).model(`${req.user.id}-sections`, sectionSchema, "sections").findOne({ title: collection })
    } catch (error) {
        res.status(500);
    }
    if (post || typeSet.includes(collection)) {
        next()
    }
    else {
        return res.status(400).json({ message: "Couldn't find section" })
    }
}

module.exports = { listData, listSections, listCategories, addData, patchData, deleteData, checkBody, checkCollection }
