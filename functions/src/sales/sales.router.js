const express = require('express');
const router = express.Router();
const { addSales } = require('./sales.controller');

//   router.get('/', );
router.post('/', addSales);
//   router.get('/:id', );
//   router.patch('/:id', );

module.exports = router;
