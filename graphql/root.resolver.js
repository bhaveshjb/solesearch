const { merge } = require('lodash');
const BidsQueries = require('./bidAndTransaction/resolvers/bids.query.resolver');
const BidMutation = require('./bidAndTransaction/resolvers/bids.mutation.resolver');

const Query = merge({}, BidsQueries);
const Mutation = merge({}, BidMutation);

module.exports = {
  Query,
  Mutation,
};
