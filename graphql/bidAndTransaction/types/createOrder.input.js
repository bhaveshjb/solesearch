const CreateOrderInput = `
  input CreateOrderInput {
  size: String!
  slug: String!
  name: String!
  discount: String!
  price: Int!
  email: String!
  firstName: String!
  lastName: String!
  phoneNumber: String!
  buildingName: String!
  houseFlatNumber: String!
  streetName: String!
  landmark: String!
  state: String!
  cityVillage: String!
  country: String!
  zip: String!
  isBid: String!
  }
`;

module.exports = CreateOrderInput;
