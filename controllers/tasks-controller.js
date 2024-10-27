const mongoose = require("mongoose")
const { taskSchema } = require('../models/Task');

const getTenantDb = (user) => {
    const databaseId = user.id
    const db = mongoose.connection.useDb(databaseId, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`listTaskData-${req.user.id}`, taskSchema, "tasks").find()
        res.status(200).send({post, status: 200});
    } catch (error) {
        res.status(500);
    }
}

const addData = async (req, res) => {
    let body = req.body
    body.creator = req.user.name

    try {
        const post = getTenantDb(req.user).model(`addTaskData-${req.user.id}`, taskSchema, "tasks")
        const add = new post(body)
        await add.save();
        res.status(200).send(add);
    } catch (error) {
        res.status(500);
    }
}

const patchData = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`patchTaskData-${req.user.id}`, taskSchema, "tasks").findByIdAndUpdate(req.body._id , req.body)
        await post.save();
        res.status(200).send(req.body);
    } catch {
		res.status(404)
	}
}

const deleteData = async (req, res) => {
    try {
        await getTenantDb(req.user).model(`deleteTaskData-${req.user.id}`, taskSchema, "tasks").findByIdAndRemove(req.body._id)
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
