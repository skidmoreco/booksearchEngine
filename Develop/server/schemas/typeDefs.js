const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
}
type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    users: [User]!
    user:(userId: ID!): User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(userId: ID!, bookId: String!, title: String!, description: String!): User
    removeBook(book: String!): User
}`;

module.exports = typeDefs;