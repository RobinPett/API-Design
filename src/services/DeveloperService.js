/**
 * @file Class for developer service
 * @module DeveloperService
 * @author Robin Pettersson
 */

import { DeveloperRepository } from "../repositories/DeveloperRepository.js"

/**
 * Class representing a developer service.
 */
export class DeveloperService {
    _repository
    
    constructor(repository = new DeveloperRepository()) {
        this._repository = repository
    }

    /**
     * Get developers.
     */    
    async getDevelopers(filter, limit) {
        const options = { limit: limit }
        return await this._repository.get(filter, null, options)
    }

    /**
     * Get single developer.
     */
    async getDeveloper(id) {
        return await this._repository.getById({ id })
    }
}
    