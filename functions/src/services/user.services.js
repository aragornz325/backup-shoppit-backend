const { getAuth } = require('firebase-admin/auth');
const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const { sendEmail } = require('../utils/mailer');
const {
  activeSeller,
  freeTrial,
  createUser,
} = require('../utils/baseMails.js');
const Mercadopago = require('./mercadopago.services');
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const mercadopago = new Mercadopago();
const MembershipsRepository = require('../repositories/memberships.repository');

const membershipsRepository = new MembershipsRepository();
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const { config } = require('../config/config');

class UserServices {
  async transformToSeller(body, id) {
    if (body.membership_id === config.trial_membership_id) {
      await this.transforCustomerToTrialSeller(body, id);
      return { msg: 'ok is trial' };
    } else {
      await this.transformCustomerToSeller(body, id);
      return { msg: 'ok' };
    }
  }

  async setCustomerClaimToUser(user) {
    const auth = getAuth();
    functions.logger.info('seting customer claim to user');
    await auth.setCustomUserClaims(user.uid, { role: ['customer'] });
    functions.logger.info(`seting claim to user ${JSON.stringify(user)}`);
    await userRepository.createUser(user);
    const mail = {
      from: 'shoppit info',
      to: user.email,
      subject: 'tu cuenta ha sido activada',
      html: createUser(),
    };
    sendEmail(mail);
    return { msg: 'ok' };
  }

  async transformCustomerToSeller(body, id) {
    await userRepository.updateUser(
      id,
      {
        status: 'pending',
        activeVender: false,
        user_membership: {
          membership_id: body.membership_id,
        },

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

  async transforCustomerToTrialSeller(body, id) {
    const user = await userRepository.getUserById(id);
    if (!user.id) {
      functions.logger.warn('missing data to verify seller payment');
      throw boom.notAcceptable('missing data to verify seller payment');
    }
    functions.logger.info('transforming customer to seller - trial plan');
    const auth = getAuth();
    functions.logger.info('seting customer claim to user');
    await auth.setCustomUserClaims(id, { role: ['seller'] });
    functions.logger.info('updateing user');
    delete body.pagoId;
    await userRepository.updateUser(
      id,
      {
        status: 'active',
        billing: { ...body },
        pagoId: 'no payment, is trial',
        role: 'seller',
        isVender: true,
        activeVender: true,
        user_membership: {
          membership_id: body.membership_id,
          due_date: '', //TODO: revisar fecha de caducidad de la membresia
          membership_payments: [
            {
              platform_name: 'free Trial', //TODO: revisar nombre de la plataforma
              payment_platform_id: 'trial',
              payment_date: Math.floor(Date.now() / 1000),
              payment_status: 'trial',
            },
          ],
        },
      },
      true
    );
    await membershipsRepository.createMembershipHistory({
      user_id: id,
      membership_id: body.membership_id,
      membership_date: Date.now(),
    });
    const mail = {
      from: 'shoppit info',
      to: user.email,
      subject: 'tu cuenta de vendedor ha sido activada',
      html: freeTrial(),
    };
    sendEmail(mail);
    return {
      msg: 'ok is trial',
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

    const payment = {
      platform_name: 'mercadopago', //TODO: revisar nombre de la plataforma
      payment_platform_id: body.pagoId,
      payment_date: Math.floor(Date.now() / 1000), //TODO: revisar pasar a UNIX
      payment_status: response.data.status,
      preapproval_plan_id: response.data.preapproval_plan_id,
    };

    let membership_payments = user.user_membership.membership_payments ?? [];
    membership_payments.push(payment);

    let membership_id = user.user_membership.membership_id;
    if (body.membership_id !== null) {
      membership_id = body.membership_id;
    }

    const payloadtoupdate = {
      ...user,
      billing: {
        ...user.billing,
        membership_id,
      },
      user_membership: {
        membership_id,
        membership_payments,
        due_date: response.data.next_payment_date,
      },
      pagoId: body.pagoId,
      status: 'active',
      role: 'seller',
      isVender: true,
      activeVender: true,
    };

    functions.logger.info('excuting update users');
    await userRepository.updateUser(id, payloadtoupdate, true);
    functions.logger.info('sending email');
    const mail = {
      from: 'shoppit info',
      to: user.email,
      subject: 'tu cuenta ha sido activada',
      html: activeSeller(),
    };
    sendEmail(mail);
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

  async getUsers(search, role, status, limit, offset) {
    const user = await userRepository.getUsers(
      search,
      role,
      status,
      limit,
      offset
    );
    return user;
  }

  async getUserProductsByOwner(id, limit, offset) {
    const user = await productsRepository.getProductByOwner(id, limit, offset);
    return user;
  }

  async registerUser(payload) {
    let result = '';
    await getAuth()
      .createUser({
        email: payload.email,
        emailVerified: false,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        displayName: payload.displayName,
        photoURL: payload.photoURL,
        disabled: false,
      })
      .then((userrecord) => {
        functions.logger.info(
          (result = userrecord),
          `user with email:${userrecord.email} has been created, id:${userrecord.uid}`
        );
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return result;
  }

  async deleteUserFromDb(uid) {
    return await userRepository.deleteUser(uid);
  }

  async changeSuscription(body, id) {
    const verifyPayment = await this.verifySellerPayment(body, id);
    if (verifyPayment.msg !== 'ok') {
      throw boom.paymentRequired(
        'The subscription change was not made due to problems in the payment process'
      );
    }

    const user = await this.getUserById(id);
    if (
      user.user_membership.membership_payments[
        user.user_membership.membership_payments.length - 2
      ].platform_name === 'free Trial'
    ) {
      return { msg: 'ok' };
    }

    const options = {
      userId: id,
      status: 'cancelled',
      preapproval_id:
        user.user_membership.membership_payments[
          user.user_membership.membership_payments.length - 2
        ].payment_platform_id,
    };

    const updated = await mercadopago.updatedSuscription(options);
    return updated;
  }
  async getUserByIdToMobile(id) {
    const user = await userRepository.getUserById(id);

    const userToMobile = {
      email: user.email || '',
      addresses: {
        id: user.addresses.id || '',
        addressLine1: user.addresses[0].addressLine1 || '',
        addressLine2: user.addresses[0].addressLine2 || '',
        postalCode: user.addresses[0].postalCode || '',
        country: user.addresses[0].country || '',
        state: user.addresses[0].state || '',
        city: user.addresses[0].city || '',
        latitude: user.addresses[0].latitude || '',
        longitude: user.addresses[0].longitude || '',
        isMain: user.addresses[0].isMain || '',
      },
      billing: user.billing || {},
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      id: user.uid || '',
      isConsultor: user.isConsultor || '',
      isSocial: user.isSocial || '',
      isAdmin: user.isAdmin || '',
      isVender: user.isVender || '',
      loggedIn: user.loggedIn || '',
      minimum_purchase: user.minimum_purchase || '',
      picture: user.photoURL || '',
      purchases: user.purchases || '',
      sheetsId: user.sheetsId || '',
      storeName: user.displayName || '',
      storePicture: user.photoURL || '',
      url: user.photoURL || '',
      username: user.username || '',
      role: user.role || '',
    };
    return userToMobile;
  }
  async getUsersToMobile(search, role, status, limit, offset) {
    const user = await userRepository.getUsers(
      search,
      role,
      status,
      limit,
      offset
    );
    const usersToMobile = [];
    for (let i = 0; i < user.users.length; i++) {
      const userToMobile = {
        email: user.users[i].email || '',
        addresses: {
          id: user.users[i].addresses.id || '',
          addressLine1: user.users[i].addresses[0].addressLine1 || '',
          addressLine2: user.users[i].addresses[0].addressLine2 || '',
          postalCode: user.users[i].addresses[0].postalCode || '',
          country: user.users[i].addresses[0].country || '',
          state: user.users[i].addresses[0].state || '',
          city: user.users[i].addresses[0].city || '',
          latitude: user.users[i].addresses[0].latitude || '',
          longitude: user.users[i].addresses[0].longitude || '',
          isMain: user.users[i].addresses[0].isMain || '',
        },
        billing: user.users[i].billing || {},
        firstName: user.users[i].firstName || '',
        lastName: user.users[i].lastName || '',
        id: user.users[i].uid || '',
        isConsultor: user.users[i].isConsultor || '',
        isSocial: user.users[i].isSocial || '',
        isAdmin: user.users[i].isAdmin || '',
        isVender: user.users[i].isVender || '',
        loggedIn: user.users[i].loggedIn || '',
        minimum_purchase: user.users[i].minimum_purchase || '',
        picture: user.users[i].photoURL || '',
        purchases: user.users[i].purchases || '',
        sheetsId: user.users[i].sheetsId || '',
        storeName: user.users[i].displayName || '',
        storePicture: user.users[i].photoURL || '',
        url: user.users[i].photoURL || '',
        username: user.users[i].username || '',
        role: user.users[i].role || '',
      };
      usersToMobile.push(userToMobile);
    }
    return usersToMobile;
  }
}

module.exports = UserServices;
