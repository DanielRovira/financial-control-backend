const mongoose = require("mongoose")
const { purchaseSchema } = require('../models/Purchase');

const typeSet = ["sections", "categories"];

const getTenantDb = (user) => {
    const userDatabase = user.database ? user.database : user.id
    const db = mongoose.connection.useDb(userDatabase, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`listData-${req.user.id}`, purchaseSchema, "purchases").find()
        res.send({post, status: 200});
    } catch (error) {
        res.status(500);
    }
}

const addData = async (req, res) => {
    let body = req.body
    body.creator = req.user.name
    try {
        const post = getTenantDb(req.user).model(`addData-${req.user.id}`, purchaseSchema, "purchases")
        const add = new post(body)
        await add.save();
        res.send(add);
    } catch (error) {
        res.status(500);
    }
}

const patchData = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`patchData-${req.user.id}`, purchaseSchema, "purchases").findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.send(req.body);
    } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    try {
        await getTenantDb(req.user).model(`deleteData-${req.user.id}`, purchaseSchema, "purchases").findByIdAndRemove(req.body._id)
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

module.exports = { listData, addData, patchData, deleteData, checkBody }
