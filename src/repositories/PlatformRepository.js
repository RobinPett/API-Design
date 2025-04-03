/**
 * @file Class for platform repository
 * @module PlatformRepository
 * @author Robin Pettersson
 */

import { MongooseRepositoryBase } from "./MongooseRepositoryBase.js"

export class PlatformRepository extends MongooseRepositoryBase {
    constructor(model) {
        super(model)
    }
}