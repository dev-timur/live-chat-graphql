const { gql } = require('apollo-server');

module.exports = gql`
  scalar Date
  type Message {
    id: ID!
    content: String!
    author: User!
    room: Room!
    createdAt: Date!
  }
  extend type Query {
    messages(room: ID!): [Message!]
  }
  extend type Mutation {
    message(content: String!, author: ID!): Message
  }
  type Subscription {
    messageSent(room: ID!): Message
  }
`;