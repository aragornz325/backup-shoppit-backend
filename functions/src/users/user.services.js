const { getAuth } = require("firebase-admin/auth")

class UserServices {
  async customerClaimServ(user) {
    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, { customer: true });
    const userRecord = await auth.getUser(user.uid);
    return { data: userRecord.customClaims };
  }

  //! No se pueden crear usuarios dedsde el backend ya que este usa firebase-admin
  // async createUserWithEmailAndPswd(email, password) {
  //   const auth = getAuth();
  //   const user = await createUserWithEmailAndPassword(getAuth(), email, password);
  //   if (!user) throw boom.unauthorized("User already exists");
  //   return user;
  // }

}


module.exports = UserServices;
