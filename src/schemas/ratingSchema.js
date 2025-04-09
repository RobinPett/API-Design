/**
 * @file Rating Schema for GraphQL
 * @module RatingSchema
 * @author Robin Pettersson
 */

export const ratingSchema = `
  type Query {
    ratings: [Rating]!
    rating(id: ID, gameId: ID): Rating!
  }

  type Rating {
    id: ID!
    text: String!
  }
`