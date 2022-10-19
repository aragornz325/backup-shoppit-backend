const WooService = require('../services/wooCommerce.service');
const wooService = new WooService();

class wooCommerceController {
  async createProduct(req, res, next) {
    try {
      const payload = req.body;
      const product = await wooService.createProduct(payload);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
  async getProducts(req, res, next) {
    try {
      const { limit, offset } = req.query;
      const products = await wooService.getProducts(limit, offset);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const product = await wooService.updateProduct(id, payload);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await wooService.deleteProduct(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = wooCommerceController;
