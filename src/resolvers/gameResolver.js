/**
 * @file Game Resolver for GraphQL
 * @module GameResolver
 * @author Robin Pettersson
 */

const getGameService = (container) => container.resolve('GameService')
const getAuthProvider = (container) => container.resolve('AuthProvider')


/**
 * Provides Authorization for resolvers.
 * 
 * @param {*} resolver 
 * @returns 
 */
const withAuth = (resolver) => {
  return async (parent, args, context, info) => {
    const authProvider = getAuthProvider(context.container)
    return authProvider.authorizeResolver(resolver)(parent, args, context, info)
  }
}

export const gameResolvers = {
  Query: {
    games: async (_, {release_year, developers, limit}, { container }) => {
      const filter = { release_year, developers }
      return await getGameService(container).getGames(filter, limit)
    },
    game: async (_, { id }, { container }) => {
      return await getGameService(container).getGame(id)
    }
  },
  Game: {
    developers: async (game) => {
      if (!game.developers || game.developers.length === 0) {
        return []
      }
      const developers = game.developers.map(developer => ({
        id: developer.id,
        name: developer.name
      }))
      return developers
    }
  },
  Mutation: {
    addGame: withAuth(async (parent, { data }, { container, user, reply }) => {
      const newGame = await getGameService(container).addGame(data, user)
      reply.status(201) // 201 Created
      return newGame
    }),
    deleteGame: withAuth(async (parent, { id }, { container, user, reply }) => {
      const deletedGame = await getGameService(container).deleteGame(id, user)
      reply.status(204) // 204 No Content
      return deletedGame // Id of deleted game - not seen in the response
    }),
    updateGame: withAuth(async (parent, { id, data }, { container, user, reply }) => {
      const updatedGame = await getGameService(container).updateGame(id, data, user)
      reply.status(200) // 200 OK
      return updatedGame
    })
  }
}
