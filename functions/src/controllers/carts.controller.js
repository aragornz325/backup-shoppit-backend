const CartsServices = require('../services/carts.services');
const cartsServices = new CartsServices();

class CartsController {
  async createCart(req, res, next) {
    try {
      const payload = req.body;
      const result = await cartsServices.createCart(payload);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllCarts(req, res, next) {
    try {
      const result = await cartsServices.getAllCarts();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartsController;
