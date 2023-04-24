const User = require('../../models/user');
const Room = require('../../models/room');

const userResolver = {
  User: {
    id: (user) => user.id,
    name: (user) => user.name,
    room: (user) => user.room,
  },

  Query: {
    users: async () => {
      const users = await User.find().populate('room');
      return users;
    },
  },

  Mutation: {
    user: async (_, input) => {
      const { name, room: roomId } = input;

      const room = await Room.findById(roomId);

      const data = {
        name,
        room,
      };

      const user = await User.create(data);

      await user.save();
      return user.populate('room');
    },
  },
};

module.exports = userResolver