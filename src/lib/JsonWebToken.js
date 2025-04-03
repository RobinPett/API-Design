/**
 * @file Helper methods for JWT
 * @module JsonWebToken
 * @author Robin Pettersson
 */

import jwt from 'jsonwebtoken'
import { AuthorizationError } from './errors/AuthorizationError.js'

/**
 * Methods for working with JWTs
 */
export class JsonWebToken {
  #secret
  #expiresIn

  constructor (secret, expiresIn) {
    this.#secret = secret
    this.#expiresIn = expiresIn
  }

  /**
   * Creates a new JWT.
   *
   * @param {object} user - User info.
   * @param {string} secret - Secret.
   * @param {number} expiresIn - When JWT expires.
   * @returns {Promise<string>} - Promise.
   */
  async createJWT (user) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email
    }

    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.#secret,
        {
          algorithm: 'HS256',
          expiresIn: this.#expiresIn,
        },
        (error, token) => {
          if (error) {
            reject(error)
            console.error('Failed to create token', error)
            return
          }

          resolve(token)
        }
      )
    })
  }

  /**
   * Verify JWT.
   *
   * @param {string} token - Token.
   * @param {string }key - Key.
   * @returns {Promise<string>} - Promise.
   */
  async verifyJWT (token, key) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (error, decoded) => {
        if (error) {
          console.error(error)
          reject(error)
          return
        }

        const user = {
          id: decoded.sub,
          username: decoded.username,
          email: decoded.email
        }

        resolve(user)
      })
    })
  }
}
