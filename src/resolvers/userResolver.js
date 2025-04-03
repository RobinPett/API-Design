/**
 * @file User Resolver for GraphQL
 * @module UserResolver
 * @author Robin Pettersson
 */

const getUserService = (container) => container.resolve('UserService')

export const userResolvers = {
  Mutation: {
    registerUser: async (parent, { data }, {container}) => {
      return await getUserService(container).signUp(data)
    },
    loginUser: async (parent, { data }, {container}) => {
      return await getUserService(container).login(data)
    }
  }
}
