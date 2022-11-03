const { db } = require('../../config/firebase');

class WebhooksRepository {
  async woocommerceOrders(data) {
    const doc = await db.collection('webhooks').add(data);
    return { msg: 'recibed', id: doc.id };
  }

  async woocommerceUpdateProducts(data) {
    const doc = await db.collection('webhooks').add({
      msg: 'update product',
      ...data,
    });
    return { msg: 'recibed', id: doc.id };
  }
}

module.exports = WebhooksRepository;
