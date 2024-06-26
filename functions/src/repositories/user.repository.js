const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');
const { config } = require('../config/config');
const algoliasearch = require('algoliasearch');
const { chunckarray } = require('../utils/auxiliar');

const client = algoliasearch(
  `${config.algolia.algoliaUserAppId}`,
  `${config.algolia.algoliaUserApiSearch}`
);
const index = client.initIndex(`${config.algolia.algoliaUsersIndexName}`);

class UserRepository {
  async createUser(user) {
    functions.logger.info('execute create user');
    try {
      functions.logger.info(
        `check if the user with email: ${user.email} already exists`
      );
      const userInDb = await this.getUserByEmail(user.email);
      if (userInDb.email === user.email) {
        functions.logger.info(
          `the user with email ${user.email} already exists`
        );
        return { msg: 'ok' };
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
              addresses: {
                id: '',
                addressLine1: '',
                addressLine2: '',
                postalCode: '',
                country: '',
                state: '',
                city: '',
                latitude: '',
                longitude: '',
                isMain: '',
              },
              billing: {},
              firstName: newName[0] || '',
              lastName: newName[1] || '',
              id: user.uid,
              isConsultor: false,
              isSocial: false,
              isAdmin: false,
              isVender: false,
              loggedIn: true,
              minimum_purchase: 0,
              picture: user.photoURL,
              sheetsId: '',
              storeName: '',
              storePicture: null,
              url: '',
              username: user.displayName,
              devicesIds: [],
              lastDeviceId: '',
              role: 'customer',
              phoneNumber: user.phoneNumber || null,
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

    return { msg: 'ok' };
  }

  async getUsersByFilter(search) {
    let userN = [];
    const parameter = Object.keys(search).toString();
    const objetive = search[parameter];
    const collectionRef = db
      .collection('users')
      .where(parameter, '==', objetive);

    await collectionRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        userN.push(doc.data());
      });
    });
    return {
      userN,
      total: userN.length,
    };
  }

  async getUserByEmail(email) {
    const userRef = db.collection('users').where('email', '==', email);
    let user = '';
    await userRef
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          user = doc.data();
        });
      })
      .catch((err) => {
        functions.logger.info(err);
      });
    return user;
  }

  async getUsers(search, role, status, limit, offset) {
    if (!search) {
      const users = await this.getUsersWithoutAlgolia(
        role,
        status,
        limit,
        offset
      );
      return users;
    } else {
      const users = await this.getUsersWithAlgolia(
        search,
        role,
        status,
        limit,
        offset
      );
      return users;
    }
  }

  async getIndexAlgolia(search, limit, offset) {
    let usersAlgolia = [];
    let result = [];
    await index
      .search(`${search}`, {
        hitsPerPage: parseInt(limit, 10),
        length: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      })
      .then(({ hits }) => (usersAlgolia = hits))
      .catch((err) => {
        throw boom.badData(err);
      });
    usersAlgolia.forEach((user) => {
      result.push(user.objectID);
    });

    return result;
  }

  //TODO: manejar offset
  async getUsersWithoutAlgolia(role, status, limit, offset) {
    functions.logger.info('execute search users without algolia');
    let collectionRef = db.collection('users');
    if (role) {
      collectionRef = collectionRef.where('role', '==', role);
    }
    if (status) {
      collectionRef = collectionRef.where('status', '==', status);
    }

    const users = [];
    await collectionRef
      .limit(parseInt(limit, 10))
      .orderBy('lastName', 'asc')
      .startAfter(parseInt(offset, 10))
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
      })
      .catch((err) => {
        throw boom.badData(err);
      });

    if (users.length <= 0) {
      return { users: [], total: 0 };
    } else {
      return { users, total: users.length };
    }
  }
  //TODO: manejar offset
  async getUsersWithAlgolia(search, role, status, limit, offset) {
    functions.logger.info('execute search users with algolia');
    const indexAlgolia = await this.getIndexAlgolia(search, limit, offset);

    if (indexAlgolia.length <= 0) {
      return { users: [], total: 0 };
    }

    if (indexAlgolia.length <= 10) {
      let collectionRef = db
        .collection('users')
        .where('id', 'in', indexAlgolia);

      if (role) {
        collectionRef = collectionRef.where('role', '==', role);
      }
      if (status) {
        collectionRef = collectionRef.where('status', '==', status);
      }
      const users = [];
      await collectionRef
        .orderBy('lastName', 'asc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            users.push(doc.data());
          });
        })
        .catch((err) => {
          throw boom.badData(err);
        });
      if (users.length <= 0) {
        return { users: [], total: 0 };
      } else {
        return { users, total: users.length };
      }
    } else {
      const arrayChuncked = await chunckarray(indexAlgolia, 10);
      let users = [];
      for (let i = 0; i < arrayChuncked.length; i++) {
        let collectionRef = db
          .collection('users')
          .where('id', 'in', arrayChuncked[i]);

        if (role) {
          collectionRef = collectionRef.where('role', '==', role);
        }
        if (status) {
          collectionRef = collectionRef.where('status', '==', status);
        }
        const result = [];
        await collectionRef
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              result.push(doc.data());
            });
          })
          .catch((err) => {
            throw boom.badData(err);
          });
        users = users.concat(result);
      }
      return { users, total: users.length };
    }
  }

  async deleteUser(uid) {
    const userRef = db.collection('users').doc(uid);
    const user = await userRef.get();
    if (!user.exists) {
      functions.logger.error(`user with ID ${uid} not found`);
      throw boom.badData(`user with ID ${uid} not found`);
    }
    await userRef.delete();
    functions.logger.info(`delete ok`);
    return { msg: 'ok' };
  }
}
module.exports = UserRepository;
