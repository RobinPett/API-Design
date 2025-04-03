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
    games: async (_, filter, { container }) => {
      const { developer, platform, genre, release_year } = filter
      return await getGameService(container).getGames(filter)
    },
    game: async (_, { id }, { container }) => {
      return await getGameService(container).getGame({ id })
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
    addGame: withAuth(async (parent, { data }, { container, user }) => {
      return await getGameService(container).addGame(data, user)
    }),
    deleteGame: withAuth(async (parent, { id }, { container, user }) => {
      return await getGameService(container).deleteGame(id, user)
    }),
    updateGame: withAuth(async (parent, { id, data }, { container, user }) => {
      return await getGameService(container).updateGame(id, data)
    })
  }
}
