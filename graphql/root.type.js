const Transactions = require('./bidAndTransaction/types');
const BidsQueries = require('./bidAndTransaction/bids.query');
const BidMutation = require('./bidAndTransaction/bids.mutation');

module.exports = [...Transactions, BidsQueries, BidMutation];
