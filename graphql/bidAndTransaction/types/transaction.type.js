const Transactions = `
  type Transactions {
    createdBy: ID
    updatedBy: ID
    buyer: String
    razorpayOrderId: String
    success: Boolean
    orderedAt: String
    isBid: Boolean
    size: String
    gst: String
    discount: String
    slug: String
    name: String
    price: Int
    productId: String
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    buildingName: String
    houseFlatNumber: String
    streetName: String
    landmark: String
    cityVillage: String
    state: String
    country: String
    zip: String
  }
`;

module.exports = Transactions;
