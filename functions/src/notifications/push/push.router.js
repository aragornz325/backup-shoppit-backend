const express = require('express');
const router = express.Router();
const { sendPush } = require('./push.controller');

//   router.get('/', );
router.post('/', sendPush);
//   router.get('/:id', );
//   router.patch('/:id', );

module.exports = router;
