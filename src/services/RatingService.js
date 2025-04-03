/**
 * @file Class for rating service
 * @module RatingService
 * @author Robin Pettersson
 */

import { RatingRepository } from "../repositories/RatingRepository.js"

export class RatingService {
    _repository
    
    constructor(repository = new RatingRepository()) {
        this._repository = repository
    }

    /**
     * Get ratings.
     */    
    async getRatings(filter) {
        return await this._repository.get(filter)
    }

    /**
     * Get single rating.
     */
    async getRating(id) {
        return await this._repository.getById({ id })
    }
}
    