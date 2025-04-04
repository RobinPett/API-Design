/**
 * @file Genre Resolver for GraphQL
 * @module GenreResolver
 * @author Robin Pettersson
 */

const getGenreService = (container) => container.resolve('GenreService')


export const genreResolvers = {
  Query: {
    genres: async (_, filter, { container }) => {
      return await getGenreService(container).getGenres(filter)
    },
    genre: async (_, { id }, { container }) => {
      return await getGenreService(container).getGenre(id)
    }
  }
}
