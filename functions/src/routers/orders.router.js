const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/orders.contrroller');
const orderController = new OrderController();

router.get('', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
