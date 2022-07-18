const express = require('express');
const router = express.Router();
const Sheet2Controller = require('../controllers/sheet2.controller');
const sheet2Controller = new Sheet2Controller();

router.get('/:id', sheet2Controller.getSheet2);

module.exports = router;
//#endregion
