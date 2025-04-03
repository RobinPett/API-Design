/**
 * @file Class for user service
 * @module UserService
 * @author Robin Pettersson
 */

import { UserRepository } from "../repositories/UserRepository.js"

import { AuthorizationError } from "../lib/errors/AuthorizationError.js"

export class UserService {
    _repository
    _jwtService
    
    constructor(repository = new UserRepository(), jwtService) {
        this._repository = repository
        this._jwtService = jwtService
    }

    /**
     * Register user.
     * 
     * @param {object} data - User information
     * @returns {object} User object
     */    
    async signUp(data) {
        return await this._repository.createUser(data)
    }

    /**
     * Login a user.
     * 
     * @param {object} data - Username and password
     * @returns {string} JWT token
     */
    async login(data) {
        const user = await this._repository.loginUser(data)

        console.log('-------------------- JWT Service ---------------------')
        console.log(this._jwtService)

        // Generate JWT
        // TODO: Error handling?
        const token = this._jwtService.createJWT(user, process.env.JWT_SECRET, process.env.JWT_EXPIRATION)
        return { token }
    }

    /**
     * Get user from repository.
     *
     * @param {String} id 
     * @returns 
     */
    async getUser(id) {
        return await this._repository.get(id)
    }

    async authorize(token) {
        if (!token) {
            throw new AuthorizationError('No token provided')
        }

        // Verify JWT
        try {
            const decodedUser = await this._jwtService.verifyJWT(token, process.env.JWT_SECRET)
            return decodedUser
        } catch (error) {
            console.error('Authorization error:', error)
            throw error
        }
    }
}
    