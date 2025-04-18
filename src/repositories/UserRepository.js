/**
 * @file Class for user repository
 * @module UserRepository
 * @author Robin Pettersson
 */

import { MongooseRepositoryBase } from "./MongooseRepositoryBase.js"
import { DuplicationError } from "../lib/errors/DuplicationError.js"

export class UserRepository extends MongooseRepositoryBase {

    #model

    constructor(model) {
        super(model)
        this.#model = model
    }

    /**
     * Creates a new user in the database.
     *
     * @param {object} data - User information 
     * @returns user
     */
    async createUser(data) {
        const { username, email, password } = data

        console.log('Creating user:', username, email, password)

        const user = this.create({
            email,
            username,
            password
        })

        return user
    }

    /**
     * Authenticates login information.
     * 
     * @param {object} data - Username and password
     * @returns 
     */
    async loginUser(data) {
        const { username, password } = data

        const userDocument = await this.#model.authenticate(username, password)
        const user = userDocument.toObject()

        return user
    }
}