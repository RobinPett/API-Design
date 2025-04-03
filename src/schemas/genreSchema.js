/**
 * @file Genre Schema for GraphQL
 * @module genreSchema
 * @author Robin Pettersson
 */

export const genreSchema = `
  type Query {
    genres: [Genre]
    genre(id: ID!): Genre
  }

  type Genre {
    id: ID!
    name: String!
  }
`