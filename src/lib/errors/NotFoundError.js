
/**
 * Custom error class for handling not finding documents in database.    
 */
export class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'RepositoryError'
        this.statusCode = 404 // Not found error
    }
}