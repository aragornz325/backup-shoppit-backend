const express = require('express');
const router = express.Router();

const MercadoPagoController = require('../controllers/mercadoPago.controller');
const mercadopagoController = new MercadoPagoController();

router.post('/webhook', mercadopagoController.createWebhook);

module.exports = router;
