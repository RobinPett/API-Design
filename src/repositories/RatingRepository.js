/**
 * @file Class for rating repository
 * @module RatingRepository
 * @author Robin Pettersson
 */

import { MongooseRepositoryBase } from "./MongooseRepositoryBase.js"

export class RatingRepository extends MongooseRepositoryBase {
    constructor(model) {
        super(model)
    }
}