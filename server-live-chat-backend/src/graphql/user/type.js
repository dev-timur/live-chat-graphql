const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    room: Room
  }
  type Query {
    users: [User!]
  }
  type Mutation {
    user(name: String!, room: ID): User
  }
`;