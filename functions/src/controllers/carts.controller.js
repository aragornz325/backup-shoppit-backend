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

  async updateCart(req, res, next) {
    try {
      const payload = req.body;
      const cart_id = req.params.cart_id;
      const result = await cartsServices.updateCart(payload, cart_id);
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

  async getCartById(req, res, next) {
    try {
      const cart_id = req.params.cart_id;
      const result = await cartsServices.getCartById(cart_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCart(req, res, next) {
    try {
      const cart_id = req.params.cart_id;
      const result = await cartsServices.deleteCart(cart_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartsController;
