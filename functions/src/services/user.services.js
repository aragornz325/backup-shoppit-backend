const { getAuth } = require('firebase-admin/auth');
const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const { sendEmail } = require('../utils/mailer');
const { activeSeller } = require('../utils/baseMails.js');
const Mercadopago = require('./mercadopago.services');
const UserRepository = require('../repositories/user.repository');
const { auth } = require('firebase-admin');
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

    if (!user.id || !body.pagoId) {
      functions.logger.warn('missing data to verify seller payment');
      throw boom.notAcceptable('missing data to verify seller payment');
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
      to: user.email,
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

  async deactivateUser(id) {
    await getAuth().updateUser(id, {
      disabled: true,
    });

    await userRepository.updateUser(
      id,
      {
        status: 'deactivated',
      },
      true
    );
    functions.logger.info(`user with id:${id} has been deactivated`);
  }

  async activateUser(id) {
    await getAuth().updateUser(id, {
      disabled: false,
    });

    await userRepository.updateUser(
      id,
      {
        status: 'activated',
      },
      true
    );
    functions.logger.info(`user with id:${id} has been activated`);
  }

  async getOne(query) {
    const user = await userRepository.getOne(query);
    return user;
  }
}

module.exports = UserServices;
