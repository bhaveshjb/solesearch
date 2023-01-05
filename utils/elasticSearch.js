import config from '../config/config';

require('@elastic/elasticsearch');
// const { Client } = require('@elastic/elasticsearch');
const elasticsearch = require('elasticsearch');

const esclient = new elasticsearch.Client({
  host: config.es.esUrl,
});

// async function run() {
//   try {
//     await esclient.cluster.health({});
//     console.log('Elasticsearch is available');
//   } catch (error) {
//     console.log('Error connecting to Elasticsearch');
//   }
// }
// run().catch();

module.exports = { esclient };
