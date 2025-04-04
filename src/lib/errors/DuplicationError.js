
/**
 * Custom error class for handling duplication errors in database.    
 */
export class DuplicationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DuplicationError'
        this.statusCode = 409 // Duplicate error
    }
}