/**
 * @file Developer Resolver for GraphQL
 * @module DeveloperResolver
 * @author Robin Pettersson
 */

const getDeveloperService = (container) => container.resolve('DeveloperService')
const getGameService = (container) => container.resolve('GameService')


export const developerResolvers = {
  Query: {
    developers: async (_, {filter, limit}, { container }) => {
      return await getDeveloperService(container).getDevelopers(filter, limit)
    },
    developer: async (_, { id }, { container }) => {
      return await getDeveloperService(container).getDeveloper(id)
    }
  },
  Developer: {
    games: async (parent, developer, { container }) => {
      const games = await getGameService(container).getGames({ developers: parent.id })
      return games
    }
  }
}
