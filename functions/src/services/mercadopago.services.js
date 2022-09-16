require('dotenv').config();
const { config } = require('../config/config');
const boom = require('@hapi/boom');
const axios = require('axios');
const MercadoPagoRepository = require('../repositories/mercadoPago.repository');
const mercadoPagoRepository = new MercadoPagoRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
// const UserServices = require('../services/user.services');
// const userServices = new UserServices();
const functions = require('firebase-functions');

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
    functions.logger.log('save subscription');
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

  async updatedSuscription(body) {
    //url con el id de la suscripcion

    const url = `${config.urlConsult}/${body.preapproval_id}`;
    try {
      const paused = await axios.put(
        url,
        { status: body.status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.tokenConsult}`,
          },
        }
      );

      const payload = {
        status: body.status,
        isVender: false,
        user_membership: {
          membership_status: body.status,
        },
      };
      await userRepository.updateUser(body.userId, payload, true);
      return paused.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = MercadopagoServices;
