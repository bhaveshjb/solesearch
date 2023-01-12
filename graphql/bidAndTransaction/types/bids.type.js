const Bids = `
  type Bids {
    createdBy: ID
    updatedBy: ID
    orderId: String
    slug: String
    name: String
    price: Int
    size: String
    buyer: String
    active: Boolean
    accepted: Boolean
    sellerNotified: Boolean
    buyerNotified: Boolean
    expiry: String
    paymentDeadline: String
    seller: String
    completed: Boolean
  }
`;

module.exports = Bids;
