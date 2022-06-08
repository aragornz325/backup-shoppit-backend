const { getAuth } = require('firebase-admin/auth');
const { db } = require('../../config/firebase');
require('dotenv').config();
const axios = require('axios');
const boom = require('@hapi/boom');

const apikey = process.env.apikey;

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
      const channel = await axios.get(
        `https://nova-back.astroselling.com/jupiter/v1/channels?api_token=${apikey}`
      );
      return channel.data;
    } catch (error) {
      throw boom.badData(error);
    }
  }

  async updateSellerServ(body) {
    const userRef = db.collection('users').doc(body.uid);
    const user = await userRef.get();
    if (!user.exists) {
      throw boom.badData('user not found');
    }
    const updSellerInfo = await userRef.update({
      isVender: true,
      activeVender: false,
      billing: { ...body },
    });

    return {
      ...updSellerInfo,
    };
  }
}

module.exports = UserServices;
