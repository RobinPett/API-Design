/**
 * @file Base class for MongooseRepositoriy
 * @module MongooseRepositoryBase
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'

// Errors
import { DuplicationError } from '../lib/errors/DuplicationError.js'
import { ValidationError } from '../lib/errors/ValidationError.js'
import { NotFoundError } from '../lib/errors/NotFoundError.js'
import { RepositoryError } from '../lib/errors/RepositoryError.js'

/**
 * Class representing a Mongoose repository base.
 */
export class MongooseRepositoryBase {
  
  /**
   * The mongoose model
   * 
   * @type {mongoose.Model}
   */
  #model

  /**
   * Initializes the mongoose repository.
   * @param {mongoose.Model} model  The mongoose model
   */
  constructor(model) {
    this.#model = model
  }

  /**
   * Get documents.
   *
   * @param {object} filter 
   * @param {object|string|string[]} projection 
   * @param {object} options 
   * @returns {Promise<mongoose.Model[]>}
   */
  async get (filter, projection = null, options = null) {
    try {
      const documents = await this.#model
        .find(filter, projection, options)
        // .limit(10)
        .exec()

      if (!documents) throw new NotFoundError('Documents not found')
      return documents
    } catch (error) {
      if (error instanceof NotFoundError) throw error // Custom error
      throw new RepositoryError('Failed to get documents: ' + error )
    }
  }

  /**
   * Get a single document by id.
   *
   * @param {object} filter 
   * @param {object|string|string[]} projection 
   * @param {object} options 
   * @returns {Promise<mongoose.Model[]>}
   */
  async getById(id, projection, options) {
    try {
      console.log('Id:', id)
      const document = await this.#model
        .findOne(id, projection, options) // Not using default _id from mongoDB
        .exec()

        if (!document) {
          throw new NotFoundError('Document not found')
        }

        return document
    } catch (error) {
      if (error instanceof NotFoundError) throw error // Custom error
      throw new RepositoryError('Failed to get resource')
    }
  }

  /**
   * Creates a new document in the database.
   *
   * @param {object} data 
   * @returns {Promise<mongoose.Model>}
   */
  async create(data) {
    try {
      return await this.#model.create(data)
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicationError('Duplicate key error')
      }

      if (error.name === 'ValidationError') {
        throw new ValidationError('Validation error: ' + error.message)
      }

      throw new Error('Failed to create document: ' + error) // TODO: Add custom Repository error
    }
  }

  async delete (id) {
    try {
      this.getById(id) // Check if document exists before deleting
      this.#model.deleteOne({ id }).exec()
      return { id }
    } catch (error) {
      throw new RepositoryError('Failed to delete document: ' + error)
    }
  }

  async update (id, data) {
    try {
      await this.#model.updateOne({ id }, data).exec()
      return this.getById({ id })
    } catch (error) {
      throw new RepositoryError('Failed to update document: ' + error)
    }
  }
}
