
/**
 * Custom error class for handling validation errors in database.    
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ValidationError'
        this.statusCode = 400 // Bad request
    }
}