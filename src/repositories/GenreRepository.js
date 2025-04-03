/**
 * @file Class for genre repository
 * @module GenreRepository
 * @author Robin Pettersson
 */

import { MongooseRepositoryBase } from "./MongooseRepositoryBase.js"

export class GenreRepository extends MongooseRepositoryBase {
    constructor(model) {
        super(model)
    }
}