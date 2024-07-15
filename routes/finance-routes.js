const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const { listData, listSections, listCategories, addData, patchData, deleteData } = require('../controllers/finance-controller');
const { isAuthenticated } = require('../controllers/auth-controller');

const checkBody = (req,res,next) => {
    if ('_id' in req.body) {
        req.body._id = mongoose.Types.ObjectId(req.body._id)
    }
    next()
}

router.use('*', isAuthenticated);
router.get('/list/:id', listData);
router.get('/sections', listSections);
router.get('/categories', listCategories);
router.post('/add/:id', addData);
router.patch('/update/:id', checkBody, patchData);
router.delete('/delete/:id', checkBody, deleteData);

module.exports = router
