const { getAuth } = require('firebase-admin/auth');
const { db } = require('../../config/firebase');
require('dotenv').config();
const axios = require('axios');
<<<<<<< HEAD
const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const { auth } = require('firebase-admin');
const { sendEmail } = require('../utils/mailer');
const { activeSeller } = require('../utils/baseMails.js');
const { info } = require('firebase-functions/logger');
=======
const boom = require('@hapi/boom')
const functions = require('firebase-functions')
const apikey = process.env.apikey
>>>>>>> a73143b7075765ea44a251719510c555212c1bb7

const apikey = process.env.apikey;
const URL = process.env.URL_ASTRO;

class UserServices {
  async customerClaimServ(id, user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(id, {
      customer: true,
    });
    const userRecord = await auth.getUser(id);
<<<<<<< HEAD
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

=======
    functions.logger.info(userRecord);
    await this.addUserToFirestore(user);
    functions.logger.info('seteando custom claim')
>>>>>>> a73143b7075765ea44a251719510c555212c1bb7
    return { data: userRecord.customClaims };
  }

  async addUserToFirestore(user) {
    try {
      const userRecord = await db.collection('users').doc(user.uid).get()
      if (userRecord.exists) {
        functions.logger.info('usuario ya existe en la DB')
      } else {
        //Agregar el usuario a la base de datos
        db.collection('users').doc(user.uid).set({
          email: user.email,
          id: user.uid
        }).then((data) => { functions.logger.info(`user created successfully ${data}`) })
          .catch((error) => { functions.logger.info(error) })
      }
    } catch (error) {
      throw boom.badData(error)
    }
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
