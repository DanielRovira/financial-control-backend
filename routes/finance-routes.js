const express = require('express')
const router = express.Router()
const { listData, listSections, listCategories, addData, patchData, deleteData, checkBody, checkCollection } = require('../controllers/finance-controller');
const { isAuthenticated } = require('../controllers/auth-controller');
const documentAI  = require('../controllers/documentAI');

router.post('/uploadFile', documentAI);

router.use('*', isAuthenticated);
router.get('/sections', listSections);
router.get('/categories', listCategories);
router.get('/list/:id', checkCollection, listData);
router.post('/add/:id', checkCollection, addData);
router.patch('/update/:id', checkCollection, checkBody, patchData);
router.delete('/delete/:id', checkCollection, checkBody, deleteData);

module.exports = router
