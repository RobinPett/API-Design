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

    async get (filter = {}) {
        if (filter.developers) {
            filter['developers.id'] = filter.developers
            delete filter.developers
        }
        return await super.get(filter)
    }
}