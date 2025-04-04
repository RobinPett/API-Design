import fastify from 'fastify'
import mercurius from 'mercurius'
import { mercuriousConfig } from './config/mercurius.js'
import { fastifyConfig } from './config/fastify.js'
import { connectToDatabase } from './config/mongoose.js'
import { AuthorizationError } from './lib/errors/AuthorizationError.js'

const fastifyApp = fastify(fastifyConfig)

fastifyApp.register(mercurius, mercuriousConfig)

fastifyApp.setErrorHandler((error, request, reply) => {
  console.log('------------------------ Fastify Error handler -----------------------', error)

  if (error instanceof AuthorizationError) {
    reply.status(error.statusCode).send({ error: error.message })
  } else {
    reply.code(500).send({ error: error.message })
  }
})

fastifyApp.get('/', async (request, reply) => {
  reply.send({ message: 'Welcome to the Game GraphQL API' })
})

// Run server
try {
  // Connect to mongoDB
  if (process.env.NODE_ENV !== 'test') {
    await connectToDatabase(process.env.MONGODB_URI)
  }
  
  // Start server
  const server = await fastifyApp.listen({port: process.env.PORT})
  console.log('\x1b[32m%s\x1b[0m', `Graphiql playground running on: ${server}/graphiql`)
  console.log('\x1b[32m%s\x1b[0m', `Server running at: ${server}`)
  console.log('Press Ctrl-C to terminate...')

} catch (error) {
  fastifyApp.log.error(error)
  process.exit(1)
}

export default fastifyApp
