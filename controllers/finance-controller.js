const mongoose = require("mongoose")
const { financialSchema, sectionSchema } = require('../models/Finance');

const typeSet = ["sections", "categories"];

const getTenantDb = (user) => {
    const databaseId = process.env.DEFAULT_USER_DB || user.id
    const db = mongoose.connection.useDb(databaseId, { useCache: true });
    return db;
}

const listData = async (req, res) => {
    let permissions = Object.getOwnPropertyNames(req.user.permissions || {})
    let collection = req.params.id.split("-")[0]
    let sheetType = req.params.id.split("-")[1]

    const submit = async () => {
        try {
            const post = await getTenantDb(req.user).model(`${req.user.id}-${collection}`, financialSchema, "finances").find({ costCenter: collection === 'TRASH' ? { $exists: 1 } : collection , status: sheetType, deleted: collection === 'TRASH' ? true : [undefined, false] })
            res.status(200).send({post, status: 200});
        } catch (error) {
            res.status(500);
        }
    }

    if (req.user.id === req.defaultDB) {
        submit() 
    }
    else {
        if (permissions.includes(collection)) {
            if (Object.getOwnPropertyNames(req.user.permissions[collection]).includes(sheetType)) {
                submit()
            }
            else res.status(401).send({message: "Unauthorized", status: 200})
        }
        else res.status(403).send({message: "Forbidden cost centre", status: 200})
    }
}

const listSections = async (req, res) => {
    let permissions = req.user.id === req.defaultDB ? undefined : { title: Object.getOwnPropertyNames(req.user.permissions || []) } 
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-sections`, sectionSchema, "sections").find(permissions)
        res.status(200).send(post);
    } catch (error) {
        res.status(500);
    }
}

const listCategories = async (req, res) => {
    try {
        const post = await getTenantDb(req.user).model(`${req.user.id}-categories`, sectionSchema, "categories").find()
        res.status(200).send(post);
    } catch (error) {
        res.status(500);
    }
}

const addData = async (req, res) => {
    const collection = typeSet.includes(req.params.id) ? req.params.id : "finances"

    const submit = async () => {
        try {
            const post = getTenantDb(req.user).model(`${req.user.id}-${collection}`, collection === "finances" ? financialSchema : sectionSchema, collection)
            const add = new post(req.body)
            await add.save();
            res.status(200).send(add);
        } catch (error) {
            res.status(500);
        }
    }

    if (collection === "categories") {
        submit()
    }
    else if (collection === "sections" && req.user.id === req.defaultDB) {
        submit()
    }
    else if (req.user.permissions?.[req.body.costCenter]?.[req.body.status] === "edit") {
        submit()
    }
    else if (req.user.id === req.defaultDB) {
        submit()
    }
    else res.status(403).send({message: "Forbidden"})
}

const patchData = async (req, res) => {
    const submit = async () => {
        try {
            const post = await getTenantDb(req.user).model(`${req.user.id}-${req.params.id}`, financialSchema, "finances").findByIdAndUpdate(req.body._id , req.body)
            await post.save();
            res.status(200).send(req.body);
        } catch {
	    	res.status(404)
	    }
    }
    if (req.user.id === req.defaultDB) {
        submit() 
    }
    else if (req.user.permissions?.[req.body.costCenter]?.[req.body.status] === "edit") {
        submit() 
    }
    else res.status(403).send({message: "Forbidden cost centre"})
}

const deleteData = async (req, res) => {
    const collection = typeSet.includes(req.params.id) ? req.params.id.split("-")[0] : "finances"
    
    const submit = async () => {
        try {
            await getTenantDb(req.user).model(`${req.user.id}-${req.params.id}`, financialSchema, collection).findByIdAndRemove(req.body._id)
            res.status(204).send()
        } catch {
	    	res.status(404)
	    }
    }
    
    if (collection === "categories") {
        submit()
    }
    if (collection === "sections" && req.user.id === req.defaultDB) {
        submit()
    }
    // else if (req.user.permissions?.[req.body.costCenter]?.[req.body.status] === "edit") {
    //     submit()
    // }
    else if (req.user.id === req.defaultDB) {
        submit()
    }
    else res.status(403).send({message: "Forbidden cost centre"})
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
        return res.status(404).json({ message: "Couldn't find cost centre" })
    }
}

module.exports = { listData, listSections, listCategories, addData, patchData, deleteData, checkBody, checkCollection }
