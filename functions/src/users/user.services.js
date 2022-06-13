const { getAuth } = require("firebase-admin/auth");
const { db } = require("../../config/firebase");
require('dotenv').config();
const axios = require('axios');
const boom = require('@hapi/boom')
const functions = require('firebase-functions')
const apikey = process.env.apikey


class UserServices {
  async customerClaimServ(id, user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(id, {
      customer: true
    });
    const userRecord = await auth.getUser(id);
    functions.logger.info(userRecord);
    await this.addUserToFirestore(user);
    functions.logger.info('seteando custom claim')
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
      const channel = await axios.get(`https://nova-back.astroselling.com/jupiter/v1/channels?api_token=${apikey}`)
      return channel.data
      
    } catch(error) {
      throw boom.badData(error)
    }
  }

}


module.exports = UserServices;
