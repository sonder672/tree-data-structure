const express = require('express');
const router = express.Router();
const { treeController } = require('../controllers/api/tree');
const { userController } = require('../controllers/api/user');

router.use('/tree', treeController);
router.use('/user', userController);

module.exports = router;