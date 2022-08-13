const MercadopagoSercvices = require('../services/mercadopago.services');
const mercadopagoSercvices = new MercadopagoSercvices();

class MercadoPagoController {
  async createWebhook(req, res, next) {
    const id = req.params.id;
    const payload = req.body;
    try {
      mercadopagoSercvices.createWebhook(payload, id);
      res.status(200).send({ message: 'ok' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MercadoPagoController;
