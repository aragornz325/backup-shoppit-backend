const ProductsServices = require('../services/products.services');
const productsServices = new ProductsServices();

class ProductsController {
  async initSheet(req, res, next) {
    try {
      const { sheetID } = req.params.id;
      await productsServices.initSheet(sheetID);
      res.status(200).send({ msg: 'google sheet init Ok' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
