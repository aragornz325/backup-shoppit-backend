const express = require('express');
const router = express.Router();
const PaymentsController = require('../controllers/payments.controller');
const paymentsController = new PaymentsController();

router.get('', paymentsController.createPayment);
router.get('/suscription', paymentsController.createSuscription);

module.exports = router;
