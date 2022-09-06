const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/orders.contrroller');
const orderController = new OrderController();

const { checkApiKey } = require('../middlewares/auth.handler');

router.get('', checkApiKey, orderController.getOrders);
router.get('/seller', checkApiKey, orderController.getOrdersBySeller);
router.get('/:id', checkApiKey, orderController.getOrder);
router.put('/:id', checkApiKey, orderController.updateOrder);
router.delete('/:id', checkApiKey, orderController.deleteOrder);

module.exports = router;
