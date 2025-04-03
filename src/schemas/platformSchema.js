/**
 * @file Platform Schema for GraphQL
 * @module platformSchema
 * @author Robin Pettersson
 */

export const platformSchema = `
  type Query {
    platforms: [Platform]
    platform(id: ID!): Platform
  }

  type Platform {
    id: ID!
    name: String!
  }
`