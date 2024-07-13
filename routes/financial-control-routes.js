const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const { listData, listSections, listCategories, addData, patchData, deleteData } = require('../controllers/db-controller');
const { verifyToken } = require('../controllers/user-controller');
const { ObjectId } = require('mongodb')

const checkBody = (req,res,next) => {
    if ('_id' in req.body) {
        req.body._id = mongoose.Types.ObjectId(req.body._id)
    }
    next()
}

router.get('/list/:id', verifyToken, listData);
router.get('/sections', verifyToken, listSections);
router.get('/categories', verifyToken, listCategories);
router.post('/add/:id', verifyToken, addData);
router.patch('/update/:id', verifyToken, checkBody, patchData);
router.delete('/delete/:id', verifyToken, checkBody, deleteData);

module.exports = router
