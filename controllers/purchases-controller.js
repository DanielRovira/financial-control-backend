const mongoose = require("mongoose")
const { purchaseSchema } = require('../models/Purchase');

const defaultDB = process.env.DEFAULT_USER_DB

const getTenantDb = (user) => {
    // const userDatabase = user.database ? user.database : user.id
    const databaseId = process.env.DEFAULT_USER_DB || user.id
    const db = mongoose.connection.useDb(databaseId, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    let collections = Object.getOwnPropertyNames(req.user.permissions || {})
    let permissions = req.user.id === defaultDB ? undefined : { costCenter: collections.filter(each => Object.entries(req.user.permissions[each]).filter(each => each[0].includes('purchases'))[0].includes('purchases')) } 

    try {
        const post = await getTenantDb(req.user).model(`listData-${req.user.id}`, purchaseSchema, "purchases").find(permissions)
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
