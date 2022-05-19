const { getAuth } = require("firebase-admin/auth")

class UserServices {
  async customerClaimServ(id) {
    const auth = getAuth();
    await auth.setCustomUserClaims(id, {
      customer: true
    });
    const userRecord = await auth.getUser(id);
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

}


module.exports = UserServices;
