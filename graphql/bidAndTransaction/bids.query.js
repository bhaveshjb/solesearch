const BidsQuery = `
  type Query {
    transactionsByBuyer: [Transactions!]!

    ordersByBuyer: [Transactions!]!
    
    bidsByBuyer: [Bids!]!
    
    bidsForSeller: [Bids!]!
    
    acceptedBidsForSeller: [Bids!]!
    
    bidsByProduct(slug: String): [Bids!]!
  }
`;

module.exports = BidsQuery;
