/**
 * @file Class for platform service
 * @module PlatformService
 * @author Robin Pettersson
 */

import { PlatformRepository } from "../repositories/PlatformRepository.js"

export class PlatformService {
    _repository
    
    constructor(repository = new PlatformRepository()) {
        this._repository = repository
    }

    /**
     * Get genres.
     */    
    async getPlatforms(filter) {
        return await this._repository.get(filter)
    }

    /**
     * Get single genre.
     */
    async getPlatform(id) {
        return await this._repository.getById(id)
    }
}
    