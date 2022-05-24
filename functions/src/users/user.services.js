const { getAuth } = require("firebase-admin/auth");
const { db } = require("../../config/firebase");
require('dotenv').config();
const axios = require('axios');
const boom = require('@hapi/boom')

const apikey = process.env.apikey


class UserServices {
  async customerClaimServ(id) {
    const auth = getAuth();
    await auth.setCustomUserClaims(id, {
      customer: true
    });
    const userRecord = await auth.getUser(id);
    const check = db.collection('users').doc(userRecord).get()
    if(check){
      console.log('usuario ya existe en la DB')
    }else{
      db.collection('user').add({
        ...userRecord
      })
      .then((data)=>{console.log( `user created successfully ${data}` )})
      .catch((error)=>{console.log(error)})
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
      const chanel = await axios.get(`https://nova-back.astroselling.com/jupiter/v1/channels?api_token={${apikey}`)
      console.log(chanel)
      return chanel
      
    } catch(error) {
      throw boom.badData(error)
    }
  }

}


module.exports = UserServices;
