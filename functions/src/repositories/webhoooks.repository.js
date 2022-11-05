const { db } = require('../../config/firebase');

class WebhooksRepository {
  async woocommerceOrders(data) {
    const doc = await db.collection('webhooks').add(data);
    return { msg: 'recibed', id: doc.id };
  }

  async woocommerceUpdateProducts(data) {
    const doc = await db.collection('webhooksUpdateProduct').add({
      msg: 'update product',
      ...data,
    });
    return { msg: 'recibed', id: doc.id };
  }

  async woocommerceCreateUser(data) {
    await db.collection('webhooksCreateUser').add({
      msg: 'create user',
      userCreated: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      collection: 'users',
    });
    return { msg: 'ok' };
  }
}

module.exports = WebhooksRepository;
