const { db } = require('../../config/firebase');
const boom = require('@hapi/boom');
const ProductServices = require('../products/products.services');
const productServices = new ProductServices();
const functions = require('firebase-functions');

class SalesServices {
  async addSales(body) {
    let astroProduct = '';
    const prodRef = db.collection('products').doc(body.productId);
    const product = await prodRef.get();
    if (product.data().isAstroselling) {
      const astroConsult = await productServices.getOneAstroProduct(
        body.productId
      );
      astroProduct = astroConsult;
    }
    if (body.purchasedAmount > astroProduct.stock) {
      await productServices.updateProductStock(
        { stock_quantity: astroProduct.stock },
        body.productId
      );
      throw boom.badRequest('there is not enough stock for this sale');
    }

    const newSale = await db.collection('sales').add({ ...body });
    const stock_quantity = product.data().stock_quantity - body.purchasedAmount;
    const total_sales = product.data().total_sales + body.purchasedAmount;
    let newStock = {};
    if (stock_quantity == 0) {
      newStock = {
        stock_quantity,
        total_sales,
        in_stock: false,
      };
    } else {
      newStock = {
        stock_quantity,
        total_sales,
      };
    }
    functions.logger.info(newStock);
    await productServices.updateProductServ(newStock, body.productId);
    return newSale;
  }
}

module.exports = SalesServices;
