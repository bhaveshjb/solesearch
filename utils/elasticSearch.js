require('@elastic/elasticsearch');
// const { Client } = require('@elastic/elasticsearch');
const elasticsearch = require('elasticsearch');
// const { logger } = require('../config/logger');

// const esclient = new Client({
//   node: 'https://localhost:9200',
// });

const esclient = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace',
});

// function checkConnection() {
//   return new Promise((resolve) => {
//     let isConnected = false;
//     while (!isConnected) {
//       try {
//         const connnection = esclient.cluster.health({});
//         logger.info('Successfully connected to ElasticSearch');
//         isConnected = true;
//         // eslint-disable-next-line no-empty
//       } catch (e) {
//         logger.error('error in elasticsearch connection: ', e);
//         // isConnected = true;
//       }
//     }
//     resolve(true);
//   });
// }
module.exports = { esclient };
