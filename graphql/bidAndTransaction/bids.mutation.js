const BidsMutation = `
  type Mutation {
    createOrder(input:CreateOrderInput): CreateOrderOutput!
    acceptBid(id: ID!): MutationOutput!
  }
`;

module.exports = BidsMutation;

// rejectBid(cartId: ID!, deletions: [ID]!): Cart
// payBid(cartId: ID!, deletions: [ID]!): Cart
// createBidPayOrder(cartId: ID!, deletions: [ID]!): Cart
// createOrder(item: CreateOrderInput): MutationOutput!
