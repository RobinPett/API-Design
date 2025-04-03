/**
 * @file Mongoose config file.
 * @author Robin Pettersson
 */

import mongoose from 'mongoose'

/**
 * Establish connection to database.
 *
 * @param {string} connectionString - The connection string.
 * @returns {Promise<mongoose.Mongoose>} Resolves to a mongoose instance if successful.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose

  mongoose.set('strict', 'throw')

  mongoose.set('strictQuery', true)

  // Listen to connection events and log events
  connection.on('connected', () => console.log('Mongoose connected to MongoDB.'))
  connection.on('error', (error) => console.error(`Mongoose connection error: ${error}`))
  connection.on('disconnected', () => console.log('Mongoose disconnected from MongoDB.'))

  // Close connection if node.js process ends
  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      (async () => {
        await connection.close()
        console.log(`Mongoose disconnect from MongoDB through: ${signalEvent}.`)
        process.exit(0)
      })()
    })
  }
  // Connection to server
  console.log('MongoDB connection opened.')
  return mongoose.connect(connectionString)
}
