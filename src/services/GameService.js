/**
 * @file Class for game service
 * @module GameService
 * @author Robin Pettersson
 */

import { AuthorizationError } from "../lib/errors/AuthorizationError.js"

export class GameService {
    _repository
    _developerService
    _platformService
    _genreService
    _ratingService
    _userService

    constructor(repository, platformService, genreService, ratingService, developerService, userService) {
        this._repository = repository
        this._developerService = developerService
        this._platformService = platformService
        this._genreService = genreService
        this._ratingService = ratingService
        this._userService = userService
    }

    /**
     * Get all games.
     * TODO: Document
     */
    async getGames(filter) {
        return await this._repository.get(filter)
    }

    /**
     * Get singular game by ID
     *
     * @param {String} id 
     * @returns game
     */
    async getGame(id) {
        return await this._repository.getById(id)
    }

    /**
     * Create game.
     * 
     * @param {object} data
     */
    async addGame(data, user) {
        this.#authrizeMutation(user) // TODO: Implement authorization
        console.log('Add game method')
        const { title, release_year, genre, platforms, rating, developers } = data

        // Find genre, platform, rating and developers from respective service based on ID in data
        const allDevelopers = await this.#fetchResource('developer', developers) // TODO: Enum for developer, platform, genre, rating
        const allPlatforms = await this.#fetchResource('platform', platforms)
        const allGenres = await this.#fetchResource('genre', genre)
        const ratingObject = await this.#fetchResource('rating', rating)

        const newGame = {
            title,
            release_year,
            platforms: allPlatforms,
            genre: allGenres,
            rating: ratingObject,
            developers: allDevelopers
        }
        return await this._repository.create(newGame)
    }

    /**
     * Delete game.
     * 
     * @param {String} id 
     */
    async deleteGame(id, user) {
        this.#authrizeMutation(user) // TODO: Implement authorization
        const game = await this.getGame({ id })
        
        // TODO: Check if game exists in seperate method
        if (!game) {
            throw new Error('Game not found')
        }
        return await this._repository.delete(id)
    }

    async updateGame(id, data, user) {
        this.#authrizeMutation(user) // TODO: Implement authorization
        const game = await this.getGame( {id} )
        
        // TODO: Check if game exists in seperate method
        if (!game) throw new Error('Game not found')

        return await this._repository.update(id, data)
    }

    async #authrizeMutation(user) {
        console.log('Authorizing user:', user)

        if (!user) {
            throw new AuthorizationError('Authentication required')
        }
        
        const userFromDb = await this._userService.getUser({ id: user.id })
        
        if (!userFromDb) {
            throw new Error('User not found')
        }
    }


    async #fetchResource(type, resource) {
        switch (type) {
            case 'developer':
                return await Promise.all(resource.map((developerId) => {
                    return this._developerService.getDeveloper(developerId)
                }))
            case 'platform':
                return await Promise.all(resource.map((platformId) => {
                    return this._platformService.getPlatform(platformId)
                }))
            case 'genre':
                return await Promise.all(resource.map((genreId) => {
                    return this._genreService.getGenre(genreId)
                }))
            case 'rating':
                return await this._ratingService.getRating(resource)
            default:
                throw new Error('Invalid resource type')
        }
    }
}
