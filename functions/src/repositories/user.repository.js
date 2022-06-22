const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class UserRepository {
  async createUser(user) {
    try {
      const userRef = await db
        .collection('users')
        .where('email', '==', user.email)
        .get();
      if (userRef.exists) {
        functions.logger.info('usuario ya existe en la DB');
      } else {
        //Agregar el usuario a la base de datos
        db.collection('users')
          .doc(user.uid)
          .set({
            email: user.email,
            id: user.uid,
          })
          .then((data) => {
            functions.logger.info(`user created successfully ${data}`);
          })
          .catch((error) => {
            functions.logger.info(error);
          });
      }
    } catch (error) {
      throw boom.badData(error);
    }
  }
}

module.exports = UserRepository;
