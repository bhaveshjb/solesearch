const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./root.type');
const resolvers = require('./root.resolver');

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
