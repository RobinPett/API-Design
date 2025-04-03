/**
 * @file DeveloperModel
 * @module DeveloperModel
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create the schema
const schema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: {
    type: String,
    required: [true, 'A name is required'],
    trim: true,
    minlength: [1, 'Name must be over 1 character'],
    maxlength: [50, 'Name must not be over 50 characters']
  },
  games: [{ type: Object, ref: 'Game' }]
})

schema.add(BASE_SCHEMA)
schema.index({ createdAt: -1 })

schema.pre('save', async function (next) {
  if (!this.id) {
    const count = await DeveloperModel.countDocuments()
    this.id = `dev_${count + 1}`
  }
  next()
})

export const DeveloperModel = mongoose.model('Developer', schema)