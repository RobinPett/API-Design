/**
 * @file Rating Resolver for GraphQL
 * @module RatingResolver
 * @author Robin Pettersson
 */

const getRatingService = (container) => container.resolve('RatingService')
const getGameService = (container) => container.resolve('GameService')


export const ratingResolvers = {
  Query: {
    ratings: async (_, filter, { container }) => {
      return await getRatingService(container).getRatings(filter)
    },
    rating: async (_, { id, gameId }, { container }) => {
      console.log('RATING id', id)
      console.log('RATING gameId', gameId)

      if (id && gameId) {
        throw new Error('You can only use one of id or gameId')
      }

      if (id) {
        return await getRatingService(container).getRating(id)
      } 
      
      if (gameId) {
        const game = await getGameService(container).getGame(gameId)
        return game.rating
      }
    }
  }
}
