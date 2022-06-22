const { getAuth } = require('firebase-admin/auth');
const { db } = require('../../config/firebase');
require('dotenv').config();
const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const { sendEmail } = require('../utils/mailer');
const { activeSeller } = require('../utils/baseMails.js');
const Mercadopago = require('./mercadopago.services');
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const mercadopago = new Mercadopago();
const { jwtSign } = require('../utils/jwtSign');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

class UserServices {
  async setCustomerClaimToUser(user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, {
      customer: true,
    });
    await userRepository.createUser(user);
    functions.logger.info('seteando custom claim');
    return { msg: 'ok' };
  }

  async transformCustomerToSeller(body, id) {
    const user = await userRepository.getUserById(id);
    const token = jwtSign(id, user.name, user.email);

    await userRepository.updateUser(
      id,
      {
        isVender: true,
        status: 'pending',
        activeVender: false,
        billing: {
          tokenVerification: token,
          ...body,
        },
      },
      true
    );

    return {
      message: 'ok',
      tokenVerification: token,
    };
  }

  async verifySellerPayment(body, id) {
    jwt.verify(body.tokenVerification, config.secretJWT);
    const auth = getAuth();
    const user = await userRepository.getUserById(id);
    if (body.tokenVerification !== user.billing.tokenVerification) {
      functions.logger.error('invalid token');
      throw boom.badData('invalid token');
    }
    if (!user.isVender || !body.pagoId) {
      functions.logger.warn(
        'the user does not meet the requirements to be a seller'
      );
      throw boom.notAcceptable(
        'the user does not meet the requirements to be a seller'
      );
    }
    const response = await mercadopago.consultSubscription(body.pagoId);
    functions.logger.info(response.data);

    if (response.data.status !== 'authorized') {
      functions.logger.warn('the payment is not authorizedt');
      throw boom.badData('the payment is not authorized');
    }

    await auth.setCustomUserClaims(id, {
      seller: true,
    });

    await userRepository.updateUser(
      id,
      {
        billing: { tokenVerification: null },
        status: 'active',
      },
      true
    );

    const mail = {
      from: 'shoppit info',
      to: user.data().email,
      subject: 'tu cuenta ha sido activada',
      html: activeSeller(),
    };
    await sendEmail(mail);
    return {
      msg: 'ok',
    };
  }
}

module.exports = UserServices;
