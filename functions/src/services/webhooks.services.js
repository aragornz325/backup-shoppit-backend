const WebhooksRepository = require('../repositories/webhoooks.repository');
const webhooksRepository = new WebhooksRepository();
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();

class WebhooksService {
  async woocomerceOrders(payload) {
    const response = await webhooksRepository.woocommerceOrders(payload);
    return response;
  }

  async woocomerceUpdateProducts(payload) {
    const id = payload.id;
    //await productsRepository.updateProduct(id, payload);
    webhooksRepository.woocommerceUpdateProducts(payload);
    return { msg: 'updated' };
  }
}

module.exports = WebhooksService;
