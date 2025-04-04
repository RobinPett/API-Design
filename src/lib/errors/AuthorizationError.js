
/**
 * Custom error class for handling authorization errors.    
 */
export class AuthorizationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'AuthorizationError'
        this.statusCode = 401 // Unauthorized
    }
}