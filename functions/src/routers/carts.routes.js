const express = require('express');
const router = express.Router();
const CartsController = require('../controllers/carts.controller');
const cartsController = new CartsController();

router.post('', cartsController.createCart);
router.get('', cartsController.getAllCarts);
//router.patch('', cartsController.updateCart);
//router.delete('', cartsController.deleteCart);

module.exports = router;
