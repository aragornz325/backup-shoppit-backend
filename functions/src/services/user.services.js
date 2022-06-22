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
  async customerClaimServ(id, user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(id, {
      customer: true,
    });
    await userRepository.createUser(user);
    functions.logger.info('seteando custom claim');
    return { msg: 'ok' };
  }

  async verifyIdToken(idToken) {
    const token = await getAuth().verifyIdToken(idToken);
    return token;
  }

  async updateSellerServ(body, id) {
    const userRef = db.collection('users').doc(id);
    const planRef = db.collection('configurations').doc('planes');
    const plan = await planRef.get();
    const user = await userRef.get();
    if (!user.exists) {
      throw boom.badData('user not found');
    }
    const token = jwtSign(id, user.data().name, user.data().email);

    const updSellerInfo = await userRef.set(
      {
        isVender: true,
        status: 'pending',
        activeVender: false,
        billing: {
          tokenVerification: token,
          ...body,
        },
      },
      { merge: true }
    );

    // let planValue = '';
    // switch (body.suscription) {
    //   case 'planBasic':
    //     planValue = plan.data().planBasic;
    //     break;
    //   case 'planPro':
    //     planValue = plan.data().planPro;
    //     break;
    //   case 'planPremium':
    //     planValue = plan.data().planPremium;
    //     break;
    //   default:
    //     planValue = plan.data().planBasic;
    //}

    //const reason = body.suscription;
    //const amount = planValue;
    //const frequency = 1;

    //const payment = await mercadopago.createPlan(reason, amount, frequency);
    return {
      msg: 'customer status is seller: inactive',
      tokenVerification: token,
    };
  }

  async activeSellerServ(body, id) {
    const payload = jwt.verify(body.tokenVerification, config.secretJWT);
    const auth = getAuth();
    const userRef = db.collection('users').doc(id);
    const user = await userRef.get();
    if (body.tokenVerification !== user.data().billing.tokenVerification) {
      throw boom.badData('token invalid');
    }
    if (!user.data().isVender || !body.pagoId) {
      throw boom.notAcceptable(
        'the user does not meet the requirements to be a seller'
      );
    }
    const response = await mercadopago.consultSubscription(body.pagoId);
    functions.logger.info(response.data);

    if (response.data.status !== 'authorized') {
      throw boom.badData('the payment is not authorized');
    }

    await auth.setCustomUserClaims(id, {
      seller: true,
    });
    const updSellerInfo = await userRef.set(
      {
        billing: { tokenVerification: null },
        status: 'active',
      },
      { merge: true }
    );
    const mail = {
      from: 'shoppit info',
      to: user.data().email,
      subject: 'tu cuenta ha sido activada',
      html: activeSeller(),
    };
    const send = await sendEmail(mail);
    functions.logger.info(send);
    return {
      msg: 'the user was set as an active seller',
      ...updSellerInfo,
    };
  }

  async setAdminServ(body) {
    const auth = getAuth();
    const userRef = db.collection('users').doc(body.id);
    const user = await userRef.get();
    if (!user.data().isVender) {
      /* se debe cambiar por la evaluacion necesaria para ser admin*/
      throw boom.notAcceptable(
        'the user does not meet the requirements to be a Admin'
      );
    }
    await auth.setCustomUserClaims(body.id, {
      admin: true,
    });
    const updSellerInfo = await userRef.update({
      isAdmin: true,
    });
    return {
      msg: 'the user was set as an admin',
      ...updSellerInfo,
    };
  }
}

module.exports = UserServices;
