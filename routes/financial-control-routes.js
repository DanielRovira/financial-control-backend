const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const { listData, listSections, listCategories, addData, patchData, deleteData } = require('../controllers/db-controller');
// const { verifyToken } = require('../controllers/user-controller');
// const { ObjectId } = require('mongodb')

const checkBody = (req,res,next) => {
    if ('_id' in req.body) {
        req.body._id = mongoose.Types.ObjectId(req.body._id)
    }
    next()
}

router.get('/list/:id', listData);
router.get('/sections', listSections);
router.get('/categories', listCategories);
router.post('/add/:id', addData);
router.patch('/update/:id', checkBody, patchData);
router.delete('/delete/:id', checkBody, deleteData);

module.exports = router
