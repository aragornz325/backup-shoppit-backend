require('dotenv').config();
const { config } = require('../config/config');
const boom = require('@hapi/boom');
const axios = require('axios');

class Mercadopago {
  async createPlan(reason, amount, frequency) {
    if (!reason || !amount || !frequency) {
      throw boom.badRequest('missing required fields');
    }

    const body = {
      back_url: config.backUrlMp,
      reason: reason,
      auto_recurring: {
        frequency: frequency,
        frequency_type: 'months',
        transaction_amount: amount,
        currency_id: 'ARS',
      },
    };

    try {
      let result = await axios.post(config.urlConsultaPagos, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ` + config.tokenMP,
        },
      });
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
}

module.exports = Mercadopago;
