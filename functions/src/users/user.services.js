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

  async createUserServ(user) {
    const newUser = await db.collection("users").add({
      user
    });
  }

async createUserWithEmailAndPasswordsev (data){
  const {email, password} = data
  const auth = getAuth();
  const newUser = await service.createUserWithEmailAndPswd(email, password)
  if (!user){
    throw boom.badData('no se creo el usuario')
  };
  return user
}

}


module.exports = UserServices;
