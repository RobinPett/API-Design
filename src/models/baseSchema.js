/**
 * @file Base Model Schema
 * @module baseSchema
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'

const convertOptions = Object.freeze({
  getters: true,
  versionKey: false,
  
  /**
   * Removes the _id property when transforming the document.
   *
   * @param {object} doc - The document being converted.
   * @param {object} ret - The plain object representation which has been converted.
   * @returns {object} The transformed object.
   */
  transform: (doc, ret) => {
    delete ret._id
    return ret
  }
})

// The base schema
const baseSchema = new mongoose.Schema({}, {
  timestamps: true,
  toObject: convertOptions,
  toJSON: convertOptions,
  optimisticConcurrency: false
})

export const BASE_SCHEMA = Object.freeze(baseSchema)