const { getAuth } = require('firebase-admin/auth');
const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

const masivecustomClaim = async (req, res, next) => {
  try {
    const auth = getAuth();
    let allUsers = [];
    let filterUser = [];
    const users = await db.collection('users').get();
    users.docs.map((doc) => {
      allUsers.push({ id: doc.id });
    });

    for (let i = 0; i < allUsers.length; i++) {
      const user = await db.collection('users').doc(allUsers[i].id).get();
      if (!user.data().email) {
        await db.collection('users').doc(allUsers[i].id).delete();
      } else {
        filterUser.push(allUsers[i]);
      }
    }
    functions.logger.log(filterUser);
    for (let i = 0; i < allUsers.length; i++) {
      try {
        await auth.setCustomUserClaims(filterUser[i].id, {
          customer: true,
        });
      } catch (error) {
        throw boom.badData(error);
      }
    }

    res
      .status(200)
      .send({ msg: `${filterUser.length} usuarios seteados en customer` });
  } catch (error) {
    next(error);
  }
};

module.exports = { masivecustomClaim };
