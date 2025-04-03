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
    rating: async (_, gameId, { container }) => {
      const game = await getGameService(container).getGame(gameId)
      const ratingId = game.rating.id
      console.log(ratingId)
      
      return await getRatingService(container).getRating(ratingId)
    }
  }
}
