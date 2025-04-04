
/**
 * Custom error class for errors occuring in the repository layer.   
 */
export class RepositoryError extends Error {
    constructor(message) {
        super(message)
        this.name = 'RepositoryError'
        this.statusCode = 500
    }
}