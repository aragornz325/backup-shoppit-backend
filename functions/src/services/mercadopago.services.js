require('dotenv').config();
const { config } = require('../config/config');
const boom = require('@hapi/boom');
const axios = require('axios');
const MercadoPagoRepository = require('../repositories/mercadoPago.repository');
const mercadoPagoRepository = new MercadoPagoRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();

class MercadopagoServices {
  async consultSubscription(id) {
    if (!id) {
      throw boom.badRequest('missing required fields');
    }
    try {
      let consult = await axios.get(`${config.urlConsult}/${id}`, {
        headers: {
          Authorization: `Bearer ${config.tokenConsult}`,
        },
      });

      return consult;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createWebhook(payload) {
    if (!payload) {
      throw boom.badRequest('missing required fields');
    }
    let webhook = await mercadoPagoRepository.createWebhook(payload);
    return webhook;
  }

  async createPayment() {
    const url = 'https://api.mercadopago.com/checkout/preferences';

    const body = {
      payer_email: 'test_user_46945293@testuser.com',
      items: [
        {
          title: 'Dummy Title',
          description: 'Dummy description',
          picture_url: 'http://www.myapp.com/myimage.jpg',
          category_id: 'category123',
          quantity: 1,
          unit_price: 10,
        },
      ],
      back_urls: {
        failure: '/failure',
        pending: '/pending',
        success: 'http://www.google.com',
      },
    };

    const payment = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.accesTokenMp}`,
      },
    });

    return payment.data;
  }

  async createSubscription() {
    console.log('ejecutando suscripcion');

    const body = {
      reason: 'Suscripción de ejemplo',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 1000,
        currency_id: 'ARS',
      },
      back_url: 'https://google.com.ar',
      payer_email: 'test_user_46945293@testuser.com',
    };

    const subscription = await axios.post(config.urlConsultaPagos, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.accesTokenMp}`,
      },
    });

    return subscription.data;
  }

  async updatedSuscription(payload) {
    //url con el id de la suscripcion
    const url = `${config.urlConsult}/${payload.preapproval_id}`;

    const paused = await axios.put(
      url,
      { status: payload.status },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accesTokenMp}`,
        },
      }
    );
    const body = {
      user_membership: {
        membership_status: payload.status,
      },
    };
    await userRepository.updateUser(payload.userId, body, true);
    return paused.data;
  }
}

module.exports = MercadopagoServices;
