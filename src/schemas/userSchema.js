/**
 * @file User Schema for GraphQL
 * @module UserSchema
 * @author Robin Pettersson
 */

export const userSchema = `
  type Mutation {
    registerUser(data: CreateUserInput!): User!
    loginUser(data: CreateLoginInput!): AuthPayload!
  }

  type User {
    email: String!
    username: String!
  }  

  input CreateUserInput {
    id: ID
    email: String!
    username: String!
    password: String!
  }

  input CreateLoginInput {
    username: String!
    password: String!
  }

  type AuthPayload {
    token: String!
  }
`