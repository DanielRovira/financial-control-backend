const express = require('express');
const router = express.Router();
const { checkBody } = require('../controllers/finance-controller');
const { isAdminAuthenticated, getUsersList, patchUserData } = require('../controllers/users-controller');

router.use('*', isAdminAuthenticated);
router.get('/get', getUsersList);
router.patch('/update/:id', checkBody, patchUserData);

module.exports = router;
