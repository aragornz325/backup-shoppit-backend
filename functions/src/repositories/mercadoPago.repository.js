const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class MercadoPagoRepository {
  async createWebhook(payload) {
    await db
      .collection('webhooks')
      .add(payload)
      .then((docRef) => {
        return docRef.id;
      })
      .catch((error) => {
        throw boom.badData(error);
      });
  }
}

module.exports = MercadoPagoRepository;
