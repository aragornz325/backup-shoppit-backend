const { db } = require('../../config/firebase');
const { config } = require('../config/config');
const functions = require('firebase-functions');

class OrderRepository {
  async createOrder(order) {
    await db.collection('orders').add(order);
    return { msg: 'ok' };
  }

  async getOrders(limit, offset) {
    const orders = [];
    await db
      .collection('orders')
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit, 10))
      .startAfter(parseInt(offset, 10))
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          orders.push(doc.data());
        });
      })
      .catch((err) => {
        functions.logger.info(err);
      });
    return {
      orders,
      total: orders.length,
    };
  }

  async getOrder(id) {
    const order = [];
    await db
      .collection('orders')
      .doc(id)
      .get()
      .then((doc) => {
        order.push(doc.data());
      })
      .catch((err) => {
        functions.logger.info(err);
      });
    return order;
  }

  async updateOrder(id, order) {
    await db.collection('orders').doc(id).update(order);
    return { msg: 'ok' };
  }

  async deleteOrder(id) {
    await db.collection('orders').doc(id).delete();
    return { msg: 'ok' };
  }
}

module.exports = OrderRepository;
