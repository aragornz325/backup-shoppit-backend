const ProductsServices = require('../services/products.services');
const productsServices = new ProductsServices();
const boom = require('@hapi/boom');

class ProductsController {
  async createProduct(req, res, next) {
    const id = req.params.id;
    const payload = req.body;
    try {
      await productsServices.createProduct(payload, id);
      res.status(201).send({ message: 'Product created' });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productsServices.getProductById(req.params.id);
      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const products = await productsServices.getProducts(req.query);
      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const id = req.params.id;
      const payload = req.body;
      const merge = req.body.merge || true;
      await productsServices.updateProduct(id, payload, merge);
      res.status(200).send({ message: 'Product updated' });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        throw boom.badRequest('Product id is required');
      }
      await productsServices.deleteProduct(id);
      res.status(200).send({ message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
