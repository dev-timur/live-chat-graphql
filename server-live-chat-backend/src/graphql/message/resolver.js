const { PubSub } = require('apollo-server-express');
const { withFilter } = require('apollo-server');

const Message = require('../../models/message');
const User = require('../../models/user');

const pubsub = new PubSub();

const MESSAGE_SENT = 'messageSent';

const messageResolver = {
  Message: {
    id: (message) => message.id,
    content: (message) => message.content,
    author: (message) => message.author,
    room: (message) => message.room,
  },

  Query: {
    messages: async (_, input) => {
      const query = {
        room: input.room,
      };

      const options = {
        sort: {
          createdAt: 1,
        },
      };

      const messages = await Message.find(query, null, options).populate(
        'author'
      );

      return messages;
    },
  },

  Mutation: {
    message: async (_, input) => {
      const { author: authorId } = input;

      const author = await User.findById(authorId).populate('room');

      if (!author.room) {
        throw new Error('You must enter the room to send messages.');
      }

      const data = {
        content: input.content,
        author,
        room: author.room,
      };

      const message = await Message.create(data);

      pubsub.publish(MESSAGE_SENT, { messageSent: message });

      await message.save();
      return message.populate('author');
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_SENT),
        (payload, variables) =>
          payload.messageSent.room._id.equals(variables.room)
      ),
    },
  },
};

module.exports = messageResolver;
