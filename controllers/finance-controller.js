const mongoose = require("mongoose")
const { financialSchema, sectionSchema } = require('../models/Finance');

const getTenantDb = (clientID) => {
    const db = mongoose.connection.useDb(clientID, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    const collection = req.params.id
    try {
        const post = await getTenantDb(req.clientID).model(`${req.clientID}-${collection}`, financialSchema, collection).find()
        res.send({post, status: 200});
    } catch (error) {
        res.status(500);
    }
}

const listSections = async (req, res) => {
    try {
        const post = await getTenantDb(req.clientID).model(`${req.clientID}-sections`, sectionSchema, "sections").find()
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const listCategories = async (req, res) => {
    try {
        const post = await getTenantDb(req.clientID).model(`${req.clientID}-categories`, sectionSchema, "categories").find()
        res.send(post);
    } catch (error) {
        res.status(500);
    }
}

const addData = async (req, res) => {
    const collection = req.params.id
    try {
        const post = getTenantDb(req.clientID).model(`${req.clientID}-${collection}`, financialSchema, collection)
        const add = new post(req.body)
        await add.save();
        res.send(add);
    } catch (error) {
        res.status(500);
    }
}

const patchData = async (req, res) => {
    const collection = req.params.id
    try {
        const post = await getTenantDb(req.clientID).model(`${req.clientID}-${collection}`, financialSchema, collection).findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
    } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    const collection = req.params.id
    try {
        await getTenantDb(req.clientID).model(`${req.clientID}-${collection}`, financialSchema, collection).findByIdAndRemove(req.body._id)
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
        post = await getTenantDb(req.clientID).model(`${req.clientID}-sections`, sectionSchema, "sections").findOne({ title: collection })
    } catch (error) {
        res.status(500);
    }
    if (post && sheetTypeSet.includes(sheetType)) {
        next()
    }
    else {
        return res.status(400).json({ message: "Couldn't find section" })
    }
}

module.exports = { listData, listSections, listCategories, addData, patchData, deleteData, checkBody, checkCollection }
