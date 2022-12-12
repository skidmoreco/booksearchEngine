const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('books');
        },
        user: async (parent, {username}) => {
            return User.findOne({ username }).populate('books');
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError("You must be logged in!")
        }

    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { userId, book }, context) => {
            if (context.book) {
                 return User.findOneAndUpdate(
                    { _id: userId },
                    {
                        $addtoSet: { savedBooks: book },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                 );
            }
             throw new AuthenticationError('User must be logged in!');  
        },
        deleteBook: async (parent, { book }, context ) => {
            if (context.book) {
                return User.findOneAndDelete(
                    { _id: context.user._id },
                    { $pull: {savedBooks: book } },
                    { new: true }
                );
            }
            throw new AuthenticationError('You need to be logged in');
        },
    },
};

module.export = resolvers;