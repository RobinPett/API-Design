/**
 * @file Base class for MongooseRepositoriy
 * @module MongooseRepositoryBase
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'
import { DuplicationError } from '../lib/errors/DuplicationError.js'
import { ValidationError } from '../lib/errors/ValidationError.js'

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
      return await this.#model
        .find(filter, projection, options)
        // .limit(10)
        .exec()
    } catch (error) {
      throw new Error('Failed to get documents: ' + error ) // TODO: Add custom error
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
          throw new Error('Document not found') // TODO: Add custom Document not found error
        }

        return document
    } catch (error) {
      console.log(error)
      throw new Error('Failed to get document') // TODO: Add custom Repository error
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
      console.log('Delete ID' + id)
      this.#model.deleteOne({ id }).exec()
      return { id }
    } catch (error) {
      throw new Error('Failed to delete document: ' + error) // TODO: Add custom Repository error
    }
  }

  async update (id, data) {
    console.log('Update ID ' + id)
    console.log('Update data ' + data)

    try {
      await this.#model.updateOne({ id }, data).exec()
      return this.getById({ id })
    } catch (error) {
      throw new Error('Failed to update document: ' + error) // TODO: Add custom Repository error
    }
  }
}
