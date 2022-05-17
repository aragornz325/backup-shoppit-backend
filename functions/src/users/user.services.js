// const boom = require("@hapi/boom");
const { getAuth } = require("firebase/auth")
// const { db } = require("../../config/firebase");

class UserServices {
  async customerClaimServ(user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, { customer: true });
    const userRecord = await auth.getUser(user.uid);
    return { data: userRecord.customClaims };
  }

  // async createUserWithEmailAndPswd(email, password) {
  //   const auth = getAuth();
  //   const user = await createUserWithEmailAndPassword(getAuth(), email, password);
  //   if (!user) throw boom.unauthorized("User already exists");
  //   return user;
  // }
  // async signInUserWithEmailAndPswd(email, password) {
  //   const auth = getAuth();
  //   const user = await signInWithEmailAndPassword(auth, email, password);
  //   if (!user) throw boom.unauthorized("Credentials invalid");
  //   return user;
  // }

  // async createUserWithEmailAndPasswordsev(data) {
  //   const { email, password } = data
  //   const auth = getAuth();
  //   const newUser = await this.createUserWithEmailAndPswd(email, password)
  //   if (!user) {
  //     throw boom.badData('no se creo el usuario')
  //   };
  //   return user
  // }

}


module.exports = UserServices;
