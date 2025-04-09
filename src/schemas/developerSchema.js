/**
 * @file Developer Schema for GraphQL
 * @module DeveloperSchema
 * @author Robin Pettersson
 */

export const developerSchema = `
  type Query {
    developers(limit: Int): [Developer]!
    developer(id: ID!): Developer!
  }

  type Developer {
    id: ID!
    name: String!
    games: [Game]
  }
`