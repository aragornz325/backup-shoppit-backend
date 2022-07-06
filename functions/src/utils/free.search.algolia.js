const algoliasearch = require('algoliasearch');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const client = algoliasearch(
  `${config.algoliaAppId}`,
  `${config.algoliaApiSearch}`
);
const index = client.initIndex(`${config.algoliaIndexName}`);

async function freeSearch(query) {
  functions.logger.info('execute search');
  let result = [];
  const objetive = query[Object.keys(query).toString()];
  await index
    .search(`${objetive}`)
    .then(({ hits }) => (result = hits))
    .catch((error) => {
      throw new Error(error);
    });
  return result;
}

module.exports = { freeSearch };
