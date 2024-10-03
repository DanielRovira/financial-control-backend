const mongoose = require("mongoose")
const { financialSchema, sectionSchema } = require('../models/Finance');

const typeSet = ["sections", "categories"];
const defaultDB = process.env.DEFAULT_USER_DB

const getTenantDb = (user) => {
    // const userDatabase = user.database ? user.database : user.id
    const databaseId = defaultDB || user.id
    const db = mongoose.connection.useDb(databaseId, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    let permissions = Object.getOwnPropertyNames(req.user.permissions || {})
    let collection = req.params.id.split("-")[0]
    let sheetType = req.params.id.split("-")[1]

    const submit = async () => {
        try {
            const post = await getTenantDb(req.user).model(`${req.user.id}-${collection}`, financialSchema, "finances").find({ costCenter: collection , status: sheetType })
            res.send({post, status: 200});
        } catch (error) {
            res.status(500);
        }
    }

    if (req.user.id === defaultDB) {
        submit() 
    }
    else {
        if (permissions.includes(collection)) {
            if (Object.getOwnPropertyNames(req.user.permissions[collection]).includes(sheetType)) {
                submit()
            }
            else res.send({message: "Unauthorized", status: 200})
        }
        else res.send({message: "Unauthorized cost centre", status: 200})
    }
}

const listSections = async (req, res) => {
    let permissions = req.user.id === defaultDB ? undefined : { title: Object.getOwnPropertyNames(req.user.permissions) } 
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-sections`, sectionSchema, "sections").find(permissions)
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
        const post = getTenantDb(req.user).model(`${req.user.id}-${collection}`, collection === "finances" ? financialSchema : sectionSchema, collection)
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
