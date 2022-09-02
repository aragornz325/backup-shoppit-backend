const { db } = require('../../config/firebase');
const functions = require('firebase-functions');

class CheckoutRepository {
  async createOrder(order) {
    const newOrder = await db.collection('orders').add(order);
    return { order_Id: newOrder.id };
  }

  async getOrderById(id) {
    let order = {};
    await db
      .collection('ordersfake')
      .doc(id)
      .get()
      .then((doc) => {
        order = doc.data();
      })
      .catch((err) => {
        functions.logger.info(err);
      });
    return order;
  }

  async changeOrderStatus(order) {
    if (
      order.status_by_seller === 'pending' &&
      order.status_by_buyer === 'approved'
    ) {
      return { ...order, status: 'pending' };
    }
    if (
      order.status_by_buyer === 'approved' &&
      order.status_by_seller === 'approved'
    ) {
      return { ...order, status: 'approved' };
    }
    if (
      order.status_by_buyer === 'approved' &&
      order.status_by_seller === 'pendig'
    ) {
      return { ...order, status: 'pending' };
    }
    if (
      order.status_by_buyer === 'pending' &&
      order.status_by_seller === 'approved'
    ) {
      return { ...order, status: 'pending' };
    }
    if (
      order.status_by_buyer === 'pending' &&
      order.status_by_seller === 'pending'
    ) {
      return { ...order, status: 'pending' };
    }
    if (
      order.status_by_buyer === 'rejected' &&
      order.status_by_seller === 'approved'
    ) {
      return { ...order, status: 'rejected' };
    }
    if (
      order.status_by_buyer === 'rejected' &&
      order.status_by_seller === 'pending'
    ) {
      return { ...order, status: 'rejected' };
    }
    if (
      order.status_by_buyer === 'rejected' &&
      order.status_by_seller === 'rejected'
    ) {
      return { ...order, status: 'rejected' };
    }
    if (
      order.status_by_buyer === 'approved' &&
      order.status_by_seller === 'rejected'
    ) {
      return { ...order, status: 'rejected' };
    }
    if (
      order.status_by_buyer === 'pending' &&
      order.status_by_seller === 'rejected'
    ) {
      return { ...order, status: 'rejected' };
    }
    return order;
  }
}

module.exports = CheckoutRepository;
