const MercadopagoServices = require('../services/mercadopago.services');
const mercadopagoServices = new MercadopagoServices();

class PaymentsController {
  async createPayment(req, res, next) {
    try {
      const payment = await mercadopagoServices.createPayment();
      res.status(200).send(payment);
    } catch (error) {
      next(error);
    }
  }

  async createSuscription(req, res, next) {
    try {
      const subscription = await mercadopagoServices.createSubscription();
      res.status(200).send(subscription);
    } catch (error) {
      next(error);
    }
  }

  async;
}

module.exports = PaymentsController;
