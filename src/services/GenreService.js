/**
 * @file Class for genre service
 * @module GenreService
 * @author Robin Pettersson
 */

import { GenreRepository } from "../repositories/GenreRepository.js"

export class GenreService {
    _repository
    
    constructor(repository = new GenreRepository()) {
        this._repository = repository
    }

    /**
     * Get genres.
     */    
    async getGenres(filter) {
        return await this._repository.get(filter)
    }

    /**
     * Get single genre.
     */
    async getGenre(id) {
        return await this._repository.getById(id)
    }
}
    