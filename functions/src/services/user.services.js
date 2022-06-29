const { getAuth } = require('firebase-admin/auth');
const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const { sendEmail } = require('../utils/mailer');
const { activeSeller } = require('../utils/baseMails.js');
const Mercadopago = require('./mercadopago.services');
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const mercadopago = new Mercadopago();

class UserServices {
  async setCustomerClaimToUser(user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, { role: ['customer'] });
    functions.logger.info(`seting claim to user ${JSON.stringify(user)}`);
    await userRepository.createUser(user);
    return { msg: 'ok' };
  }

  async transformCustomerToSeller(body, id) {
    await userRepository.updateUser(
      id,
      {
        status: 'pending',
        activeVender: false,
        billing: {
          ...body,
        },
      },
      true
    );

    return {
      message: 'ok',
    };
  }

  async verifySellerPayment(body, id) {
    const auth = getAuth();
    const user = await userRepository.getUserById(id);
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
      await userRepository.updateUser(
        id,
        {
          isVender: false,
        },
        true
      );
      functions.logger.warn('the payment is not authorizedt');
      throw boom.badData('the payment is not authorized');
    }

    await auth.setCustomUserClaims(id, { role: ['seller'] });

    await userRepository.updateUser(
      id,
      {
        status: 'active',
        isVender: true,
        activeVender: true,
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

  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    return user;
  }

  async updateUser(id, body) {
    const user = await userRepository.updateUser(id, body, true);
    return user;
  }

  async getUserByEmail(email) {
    const user = await userRepository.getUserByEmail(email);
    return user;
  }
}

module.exports = UserServices;
