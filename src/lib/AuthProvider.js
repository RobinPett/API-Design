/**
 * Class to handle authentication and authorization for API mutations.
 */

import { AuthorizationError } from './errors/AuthorizationError.js'

export class AuthProvider {
    /**
     * Method to authorize a user for a specific mutation.
     * 
     * @param {Function} resolver 
     * @returns {Function} - Resolver function with authentication check
     */
    authorizeResolver(resolver) {
        try {
            return async (parent, args, context, info) => {
                if (!context.user) {
                    throw new AuthorizationError('Authentication required')
                }
                return resolver(parent, args, context, info)
            }
        } catch (error) {
            console.error('Authorization error:', error)
            throw error
        }

    }
}