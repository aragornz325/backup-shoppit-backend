const { getAuth } = require('firebase-admin/auth');
const { db } = require('../../config/firebase');
require('dotenv').config();
const axios = require('axios');
const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const { auth } = require('firebase-admin');

const apikey = process.env.apikey;
const URL = process.env.URL_ASTRO;

class UserServices {
  async customerClaimServ(id) {
    const auth = getAuth();
    await auth.setCustomUserClaims(id, {
      customer: true,
    });
    const userRecord = await auth.getUser(id);
    const check = db.collection('users').doc(userRecord).get();
    if (check) {
      console.log('usuario ya existe en la DB');
    } else {
      db.collection('user')
        .add({
          ...userRecord,
        })
        .then((data) => {
          console.log(`user created successfully ${data}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return { data: userRecord.customClaims };
  }

  async verifyIdToken(idToken) {
    const token = await getAuth().verifyIdToken(idToken);
    return token;
  }

  //! No se pueden crear usuarios dedsde el backend ya que este usa firebase-admin
  //TODO: Revisar si hay alguna forma o sacarlo
  // async createUserWithEmailAndPswd(email, password) {
  //   const auth = getAuth();
  //   const user = await createUserWithEmailAndPassword(getAuth(), email, password);
  //   if (!user) throw boom.unauthorized("User already exists");
  //   return user;
  // }

  async checkChannelAstroselling() {
    try {
      const channel = await axios.get(`${URL}?api_token=${apikey}`);
      return channel.data;
    } catch (error) {
      throw boom.badData(error);
    }
  }

  async updateSellerServ(body) {
    functions.logger.info(body);
    const userRef = db.collection('users').doc(body.id);
    const planRef = db.collection('configurations').doc('planes');
    const plan = await planRef.get();
    const user = await userRef.get();
    if (!user.exists) {
      throw boom.badData('user not found');
    }
    const updSellerInfo = await userRef.update({
      isVender: true,
      activeVender: false,
      billing: {
        ...body,
      },
    });

    let planValue = '';
    switch (body.suscription) {
      case 'planBasic':
        planValue = plan.data().planBasic;
        break;
      case 'planPro':
        planValue = plan.data().planPro;
        break;
      case 'planPremium':
        planValue = plan.data().planPremium;
        break;
      default:
        planValue = plan.data().planBasic;
    }

    return {
      msg: 'customer status is seller: inactive',
      planValue,
      ...updSellerInfo,
    };
  }

  async activeSellerServ(body) {
    functions.logger.info(body);
    const auth = getAuth();
    const userRef = db.collection('users').doc(body.id);
    const user = await userRef.get();
    functions.logger.info(user.data());
    if (!user.data().isVender || !body.pagoOk) {
      throw boom.notAcceptable(
        'the user does not meet the requirements to be a seller'
      );
    }
    await auth.setCustomUserClaims(body.id, {
      seller: true,
    });
    const updSellerInfo = await userRef.update({
      activeVender: true,
    });
    return {
      msg: 'the user was set as an active seller',
      ...updSellerInfo,
    };
  }
}

module.exports = UserServices;
