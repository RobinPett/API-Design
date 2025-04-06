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

    async get (filter = {}, projection = null, options = null) {
        // If filter.developers is an array, convert it to a string
        if (filter.developers) {
            filter['developers.id'] = filter.developers
            delete filter.developers
        }
        return await super.get(filter, projection, options)
    }
}