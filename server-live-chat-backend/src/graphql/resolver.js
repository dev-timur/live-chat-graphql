const user = require('./user/resolver');
const room = require('./room/resolver');
const message = require('./message/resolver');

const query = {
  Query: {
    ...user.Query,
    ...room.Query,
    ...message.Query,
  },
};

const mutation = {
  Mutation: {
    ...user.Mutation,
    ...room.Mutation,
    ...message.Mutation,
  },
};

const subscription = {
  Subscription: {
    ...message.Subscription,
  },
};

module.exports = {
  ...user,
  ...message,
  ...room,
  ...query,
  ...mutation,
  ...subscription,
};