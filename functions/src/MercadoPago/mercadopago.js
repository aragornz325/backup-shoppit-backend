require('dotenv').config();
const boom = require('@hapi/boom');
const axios = require('axios');
const config = require('../config/config');
const functions = require('firebase-functions');

const tokenMP = process.env.ACCESS_TOKEN_MP;
const urlConsult = process.env.URL_CONSULTA_MP;
const tokenConsult = process.env.TOKEN_CONSULTA_MP;

class Mercadopago {
  async createPlan(reason, amount, frequency) {
    if (!reason || !amount || !frequency) {
      throw boom.badRequest('missing required fields');
    }

    const body = {
      back_url: 'https://shoppit.com.ar/suscripcion-request',
      reason: reason,
      auto_recurring: {
        frequency: frequency,
        frequency_type: 'months',
        transaction_amount: amount,
        currency_id: 'ARS',
      },
    };

    try {
      let result = await axios.post(
        'https://api.mercadopago.com/preapproval_plan',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ` + tokenMP,
          },
        }
      );
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async consultSubscription(id) {
    if (!id) {
      throw boom.badRequest('missing required fields');
    }
    try {
      let consult = await axios.get(`${urlConsult}/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenConsult}`,
        },
      });
      return consult;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Mercadopago;
