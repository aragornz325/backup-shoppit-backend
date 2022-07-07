const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');
const { config } = require('../config/config');
const algoliasearch = require('algoliasearch');

const client = algoliasearch(
  `${config.algoliaAppId}`,
  `${config.algoliaApiSearch}`
);
const index = client.initIndex(`${config.algoliaUsersIndexName}`);

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
              isAdmin: false,
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
              role: 'customer',
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

  async getOne(search) {
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

  async getAllUsersFromDb(limit, offset) {
    let users = [];
    const collectionRef = db.collection('users').limit(parseInt(limit, 10));
    await collectionRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
    });
    return users;
  }

  async getIndexAlgolia(search, limit) {
    let usersAlgolia = [];
    let result = [];
    await index
      .search(`${search}`, {
        hitsPerPage: parseInt(limit, 10),
      })
      .then(({ hits }) => (usersAlgolia = hits))
      .catch((err) => {
        throw boom.badData(err);
      });
    usersAlgolia.forEach((user) => {
      result.push(user.objectID);
    });
    console.log(result);
    return result;
  }

  //TODO: manejar offset
  async getUsersWithoutAlgolia(role, status, limit, offset) {
    functions.logger.info('execute search users without algolia');
    let querySearch = '';
    const collectionRef = db.collection('users');
    if (role && status === undefined) {
      querySearch = collectionRef.where('rol', '==', role);
    }
    if (role === undefined && status) {
      querySearch = collectionRef.where('status', '==', status);
    }
    if (role && status) {
      querySearch = collectionRef
        .where('rol', '==', role)
        .where('status', '==', status);
    }
    if (role === undefined && status === undefined) {
      querySearch = collectionRef;
    }
    const users = [];
    await querySearch
      .limit(parseInt(limit, 10))
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
      return { users: 'no match', total: 0 };
    } else {
      return { users, total: users.length };
    }
  }
  //TODO: manejar offset
  async getUsersWithAlgolia(search, role, status, limit, offset) {
    functions.logger.info('execute search users with algolia');
    let querySearch = '';
    const collectionRef = db.collection('users');
    const indexAlgolia = await this.getIndexAlgolia(search, limit);

    if (indexAlgolia.length <= 0) {
      return { users: 'no match', total: 0 };
    }
    if (role === undefined && status === undefined) {
      querySearch = collectionRef.where('id', 'in', indexAlgolia);
    }
    if (role && status === undefined) {
      querySearch = collectionRef
        .where('id', 'in', indexAlgolia)
        .where('rol', '==', role);
    }
    if (role === undefined && status) {
      querySearch = collectionRef
        .where('id', 'in', indexAlgolia)
        .where('status', '==', status);
    }
    if (role && status) {
      querySearch = collectionRef
        .where('id', 'in', indexAlgolia)
        .where('rol', '==', role)
        .where('status', '==', status);
    }
    const users = [];
    await querySearch
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
      return { users: 'no match', total: 0 };
    } else {
      return { users, total: users.length };
    }
  }
}
module.exports = UserRepository;
