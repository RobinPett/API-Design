/**
 * @file User Resolver for GraphQL
 * @module UserResolver
 * @author Robin Pettersson
 */

const getUserService = (container) => container.resolve('UserService')

export const userResolvers = {
  Mutation: {
    registerUser: async (parent, { data }, {container, reply}) => {
      const user = await getUserService(container).signUp(data)
      reply.status(201)
      return {id: user.id}
    },
    loginUser: async (parent, { data }, {container}) => {
      return await getUserService(container).login(data)
    }
  }
}
