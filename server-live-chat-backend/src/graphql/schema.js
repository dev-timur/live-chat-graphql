const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolver')
const typeDefs = require('./type')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;