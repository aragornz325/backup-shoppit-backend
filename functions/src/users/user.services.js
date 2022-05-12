/* eslint-disable @typescript-eslint/no-var-requires */
const boom = require("@hapi/boom");
const {getAuth} = require("firebase-admin/auth");
const {db} = require("../../config/firebase");

class UserServices {
  async customerClaimServ(user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, {customer: true});
    const userRecord = await auth.getUser(user.uid);
    return {data: userRecord.customClaims};
  }

  async createUserServ() {
    const newUser = await db.collection("users").add({
    
    });
  }
}


module.exports = UserServices;
