/**
 * @file User Model Schema
 * @module UserModel
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { BASE_SCHEMA } from './baseSchema.js'
import { AuthorizationError } from '../lib/errors/AuthorizationError.js'

const { isEmail } = validator

// Create the scema
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'An email adress is required.'],
    trim: true,
    example: 'you@email.com',
    validate: [isEmail, 'Provide a valid email adress.']
  },
  username: {
    type: String,
    required: [true, 'A username is required.'],
    unique: true,
    trim: true,
    example: 'robbdub',
    match: [/^[A-Za-z][A-Za-z0-9_-]{2,255}$/, 'Provide a valid username, 2-255 characters starting with letters.']
  },
  password: {
    type: String,
    minlength: [8, 'The password must be at least 8 characters long'],
    maxlenght: [256, 'The password must be of maximum 256 characters long'],
    required: true,
    example: 'H4ckTh151fY0uC@n!'
  }
})

schema.add(BASE_SCHEMA)

// Hash the password
schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  

  try {
    this.password = await bcrypt.hash(this.password, 10)
  } catch (error) {
    next(error)
  }
})

/**
 * Searches for user in database and compares password.
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {object} User
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AuthorizationError('Invalid login attempt.')
  }

  // Return user if found
  return user
}

// Create a User model from schema above
export const UserModel = mongoose.model('User', schema)
