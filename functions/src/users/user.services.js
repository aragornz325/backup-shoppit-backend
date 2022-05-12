/* eslint-disable @typescript-eslint/no-var-requires */
const boom = require("@hapi/boom");
const {getAuth} = require("firebase-admin/auth");

class UserServices {
  async customerClaimServ(user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, {customer: true});
    const userRecord = await auth.getUser(user.uid);
    return {data: userRecord.customClaims};
  }
}


module.exports = UserServices;
