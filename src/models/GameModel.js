/**
 * @file GameModel
 * @module GameModel
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create the schema
const schema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: {
    type: String,
    required: [true, 'A title is required'],
    trim: true,
    minlength: [1, 'Title must be over 1 character'],
    maxlength: [50, 'Title must not be over 50 characters']
  },
  release_year: { type: Number, required: true, minlength: 4, maxlength: 4 },
  genres: { type: [Object] },
  platforms: { type: [Object] },
  rating: { type: Object },
  developers: { type: Object, ref: 'Developer', required: true },
})

schema.add(BASE_SCHEMA)
schema.index({ createdAt: -1 })

schema.pre('save', async function (next) {
  if (!this.id) {
    const count = await GameModel.countDocuments()
    this.id = `game_${count + 1}`
  }
  next()
})

export const GameModel = mongoose.model('Game', schema)
