/**
 * @file Platform Resolver for GraphQL
 * @module PlatformResolver
 * @author Robin Pettersson
 */

const getPlatformService = (container) => container.resolve('PlatformService')

export const platformResolvers = {
  Query: {
    platforms: async (_, filter, { container }) => {
      return await getPlatformService(container).getPlatforms(filter)
    },
    platform: async (_, { id }, { container }) => {
      return await getPlatformService(container).getPlatform(id)
    }
  }
}
