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

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await wooService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
  async getByCategories(req, res, next) {
    try {
      const id = req.params.id;
      const limit = req.query.limit || 25;
      const offset = req.query.offset || 0;
      const products = await wooService.getProductsByCategory(
        id,
        limit,
        offset
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await wooService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = wooCommerceController;
