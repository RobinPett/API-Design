/**
 * @file Class for developer service
 * @module DeveloperService
 * @author Robin Pettersson
 */

import { DeveloperRepository } from "../repositories/DeveloperRepository.js"

export class DeveloperService {
    _repository
    
    constructor(repository = new DeveloperRepository()) {
        this._repository = repository
    }

    /**
     * Get developers.
     */    
    async getDevelopers(filter) {
        return await this._repository.get(filter)
    }

    /**
     * Get single developer.
     */
    async getDeveloper(id) {
        return await this._repository.getById( { id } )
    }
}
    