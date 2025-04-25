/**
 * @file Game Schema for GraphQL
 * @module GameSchema
 * @author Robin Pettersson
 */

export const gameSchema = `
  type Query {
    games(release_year: Int, genre: String, limit: Int, page: Int): [Game]!
    game(id: ID!): Game!
  }

  type Mutation {
    addGame(data: CreateGameInput!): Game!
    deleteGame(id: ID!): ID!
    updateGame(id: ID!, data: UpdateGameInput!): Game!
  }

  type Game {
    id: ID!
    title: String!
    release_year: Int!
    genres: [Genre]
    platforms: [Platform]!
    rating: Rating
    developers: [Developer]!
  }  

  input CreateGameInput {
    id: ID
    title: String!
    release_year: Int!
    genres: [ID]
    platforms: [ID]!
    rating: ID
    developers: [ID]!
  }

  input UpdateGameInput {
    title: String
    release_year: Int
    genres: [ID]
    platforms: [ID]
    rating: ID
    developers: [ID]
  }
`