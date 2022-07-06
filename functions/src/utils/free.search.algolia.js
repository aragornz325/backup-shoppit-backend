const algoliasearch = require('algoliasearch');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const { db } = require('../../config/firebase');
const client = algoliasearch(
  `${config.algoliaAppId}`,
  `${config.algoliaApiSearch}`
);
const index = client.initIndex(`${config.algoliaIndexName}`);
const UserRepository = require('../repositories/user.repository');
const service = new UserRepository();
const boom = require('@hapi/boom');

async function freeSearch(query) {
  functions.logger.info('execute search');
  let usersAlgolia = [];
  let searchID = [];
  let result = [];
  const objetive = query[Object.keys(query).toString()];
  await index
    .search(`${objetive}`)
    .then(({ hits }) => (usersAlgolia = hits))
    .catch((error) => {
      throw new Error(error);
    });
  usersAlgolia.forEach((user) => {
    searchID.push(user.objectID);
  });

  for (let i = 0; i < searchID.length; i++) {
    const userRef = db.collection('users').doc(searchID[i]);
    const user = await userRef.get();
    if (!user.exists) {
      functions.logger.error(`user with ID ${searchID[i]} not found`);
      throw boom.badData(`user with ID ${searchID[i]} not found`);
    }
    result.push(user.data());
  }

  return result;
}

module.exports = { freeSearch };
