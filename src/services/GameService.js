/**
 * @file Class for game service
 * @module GameService
 * @author Robin Pettersson
 */

import { AuthorizationError } from "../lib/errors/AuthorizationError.js"
import { NotFoundError } from "../lib/errors/NotFoundError.js"
import { ValidationError } from "../lib/errors/ValidationError.js"

/**
 * Class representing a game service.
 */
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
     * Get games.
     * 
     * @param {object} filter - Filter object to filter games
     * @return {Array} - Array of games
     */
    async getGames(filter, limit, page = 1) {
        // Check if contents of filter is undefined or null
        console.log('Filter:', filter)

        // Check page
        if (page < 1) throw new ValidationError('Page must be greater than 0')

        // Setup options for pagination
        const options = {}
        if (limit !== null && limit !== undefined) {
            const skip = (page - 1) * limit
            options.skip = skip
            options.limit = limit
        }
        
        return await this._repository.get(filter, null, options)
    }

    /**
     * Get singular game by ID
     *
     * @param {String} id 
     * @returns game
     */
    async getGame(id) {
        return await this._repository.getById({ id })
    }

    /**
     * Create game.
     * 
     * @param {object} data
     */
    async addGame(data, user) {
        try {
            this.#authrizeMutation(user)
            console.log('Add game method')
            const { title, release_year, genres, platforms, rating, developers } = data

            // Find genres, platform, rating and developers from respective service based on ID in data
            // TODO: Enum for developer, platform, genres, rating
            const allDevelopers = await this.#fetchResource('developer', developers) 
            const allPlatforms = await this.#fetchResource('platform', platforms)
            const allGenres = await this.#fetchResource('genre', genres)
            const ratingObject = await this.#fetchResource('rating', rating)

            const newGame = {
                title,
                release_year,
                platforms: allPlatforms,
                genres: allGenres,
                rating: ratingObject,
                developers: allDevelopers
            }
            return await this._repository.create(newGame)
        } catch (error) {
            console.error('Error adding game:', error)
            error.message = `${error.message}: Failed to add game`
            throw error
        }
    }

    /**
     * Delete game.
     * 
     * @param {String} id 
     */
    async deleteGame(id, user) {
        try {
            this.#authrizeMutation(user)
            await this.getGame(id)
            return await this._repository.delete(id)
        } catch (error) {
            console.error('Error deleting game:', error)
            error.message = `${error.message}: Failed to delete game`
            throw error

        }
    }

    /**
     * Update game.
     * 
     * @param {String} id
     * @param {object} data - Game data to update
     * @param {object} user - User object
     * @returns {object} - Updated game object 
     */
    async updateGame(id, data, user) {
        try {
            this.#authrizeMutation(user)
            const game = await this.getGame(id)

            if (!game) throw new NotFoundError('Game not found')
    
            // Extracting the properties from the data object
            const updatedGameData = await this.#verifyUpdatedData(data)
    
            console.log('Updated game data:', updatedGameData)
    
            return await this._repository.update(id, updatedGameData)
        } catch (error) {
            console.error('Error updating game:', error)
            error.message = `${error.message}: Failed to update game`
            throw error
        }
    }

    /**
     * Authorize user for mutation operations.
     * 
     * @param {object} user 
     */
    async #authrizeMutation(user) {
        console.log('Authorizing user:', user)

        if (!user) {
            throw new AuthorizationError('Authentication required')
        }

        const userFromDb = await this._userService.getUser({ id: user.id })

        if (!userFromDb) {
            throw new NotFoundError('User not found')
        }
    }


    /**
     * Fetch resource based on type and resource ID.
     *
     * @param {String} type 
     * @param {Array} resource 
     * @returns 
     */
    async #fetchResource(type, resource) {
        try {
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
        } catch (error) {
            console.error('Error fetching resource:', error)
            error.message = `${error.message}: Failed to fetch ${type} to create game`
            throw error
        }

    }

    /**
     * Verify updated data by fetching resources from respective services.
     *
     * @param {object} data 
     * @returns {object} validData
     */
    async #verifyUpdatedData(data) {
        const { title, release_year, genres, platforms, rating, developers } = data

        const validDevelopers = await this.#fetchResource('developer', developers)
        const validGenres = await this.#fetchResource('genre', genres)
        const validPlatforms = await this.#fetchResource('platform', platforms)
        const validRating = await this.#fetchResource('rating', rating)

        const validData = { title, release_year, genres: validGenres, platforms: validPlatforms, rating: validRating, developers: validDevelopers }
        return validData
    }
}
