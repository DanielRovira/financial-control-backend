const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controllers/auth-controller');
const { checkBody } = require('../controllers/finance-controller');
const { getUsersList, patchUserData } = require('../controllers/users-controller');

router.use('*', isAuthenticated);
router.get('/get', getUsersList);
router.patch('/update/:id', checkBody, patchUserData);

module.exports = router;
