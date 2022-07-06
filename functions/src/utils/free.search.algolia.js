const algoliasearch = require('algoliasearch');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const UserRepository = require('../repositories/user.repository');
const service = new UserRepository();
const client = algoliasearch(
  `${config.algoliaAppId}`,
  `${config.algoliaApiSearch}`
);
const index = client.initIndex(`${config.algoliaIndexName}`);

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
    const user = await service.getUserById(searchID[i]);
    result.push(user);
  }

  return result;
}

module.exports = { freeSearch };
