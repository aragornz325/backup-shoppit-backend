const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');
const { sendEmail } = require('../utils/mailer');

class UserRepository {
  async createUser(user) {
    try {
      functions.logger.info(
        `check if the user with email: ${user.email} already exists`
      );
      const userInDb = await this.getUserByEmail(user.email);
      if (userInDb.email === user.email) {
        functions.logger.info(
          `the user with email ${user.email} already exists`
        );
      } else {
        if (!user.displayName) {
          user.displayName = ' ';
        }
        const newName = user.displayName.split(' ');
        db.collection('users')
          .doc(user.uid)
          .set(
            {
              email: user.email,
              addresses: {},
              billing: {},
              cookie: '',
              firstName: newName[0],
              lastName: newName[1],
              id: user.uid,
              identification: {},
              isConsultor: false,
              isSocial: false,
              isVender: false,
              loggedIn: true,
              minimum_purchase: 0,
              nicename: '',
              picture: user.photoURL,
              product_id_selected_from_web: '',
              purchases: [],
              recentProducts: {},
              sheetsId: '',
              storeName: '',
              storePicture: null,
              url: '',
              username: user.displayName,
              wishList: [],
            },
            { merge: true }
          )
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

  async getUserByEmail(email) {
    let userN = '';
    await db
      .collection('users')
      .where('email', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          userN = doc.data();
        });
      })
      .catch((err) => {
        functions.logger.error(err);
      });
    return userN;
  }
}

module.exports = UserRepository;
