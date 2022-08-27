const CheckoutServices = require('../services/checkout.services');
const checkoutServices = new CheckoutServices();

class CheckoutControllers {
  async createOrder(req, res, next) {
    try {
      const order = req.body;
      const result = await checkoutServices.createOrder(order);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CheckoutControllers;
