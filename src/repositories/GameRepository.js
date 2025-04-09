/**
 * @file Class for game repository
 * @module GameRepository
 * @author Robin Pettersson
 */

import { MongooseRepositoryBase } from "./MongooseRepositoryBase.js"

export class GameRepository extends MongooseRepositoryBase {
    constructor(model) {
        super(model)
    }

    /**
     * Get all games
     *
     * @param {object} filter
     * @param {object} projection 
     * @param {object} options 
     * @returns 
     */
    async get (filter = {}, projection = null, options = null) {
        // If filter.developers is an array, convert it to a string
        // Used for nested filtering of developers games
        if (filter.developers) {
            filter['developers.id'] = filter.developers
            delete filter.developers
        }

        return await super.get(filter, projection, options)
    }
}