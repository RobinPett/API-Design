/**
 * @file Class for developer repository
 * @module DeveloperRepository
 * @author Robin Pettersson
 */

import { MongooseRepositoryBase } from "./MongooseRepositoryBase.js"

export class DeveloperRepository extends MongooseRepositoryBase {
    constructor(model) {
        super(model)
    }
}