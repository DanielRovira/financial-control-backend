const express = require('express')
const router = express.Router()
const { listData, addData, patchData, deleteData, checkBody } = require('../controllers/purchases-controller');
const { isAuthenticated } = require('../controllers/auth-controller');

router.use('*', isAuthenticated);
router.get('/list', listData);
router.post('/add', addData);
router.patch('/update', checkBody, patchData);
router.delete('/delete', checkBody, deleteData);

module.exports = router
