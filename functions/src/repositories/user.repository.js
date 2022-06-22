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
        functions.logger.info(
          `the user with email ${user.email} already exists`
        );
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

  async getUserById(id) {
    const userRef = db.collection('users').doc(id);
    const user = await userRef.get();
    if (!user.exists) {
      functions.logger.error(`user with ID ${id} not found`);
      throw boom.badData(`user with ID ${id} not found`);
    }
    return user.data();
  }

  async updateUser(id, payload, merge) {
    const userRef = db.collection('users').doc(id);
    const user = await userRef.get();
    if (!user.exists) {
      functions.logger.error(`user with ID ${id} not found`);
      throw boom.badData(`user with ID ${id} not found`);
    }
    await userRef.set(payload, { merge: merge });
    functions.logger.info(`update ok`);
    return;
  }
}

module.exports = UserRepository;
