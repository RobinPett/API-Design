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
  reply.send({ message: 'Welcome to the Game GraphQL API! Send queries to /graphql or user /graphiql to access the playground' })
})

// Connect to mongoDB
if (process.env.NODE_ENV !== 'test') {
  try {
    await connectToDatabase(process.env.MONGODB_URI)
  } catch (error) {
    console.error('Error connecting to database:', error)
    process.exit(1)
  }
  
}
  
// Run server for vercel
export default async function startServer(req, res) {
  await fastifyApp.ready()
  fastifyApp.server.emit('request', req, res)
}

// Local development server with logging
if (process.env.NODE_ENV !== 'development') {
  fastifyApp.listen({port: process.env.PORT}, (error, address) => {
    if (error) {
      console.error('Error starting server:', error)
      process.exit(1)
    }
    console.log('\x1b[32m%s\x1b[0m', `Graphiql playground running on: ${address}/graphiql`)
    console.log('\x1b[32m%s\x1b[0m', `Server running at: ${address}`)
    console.log('Press Ctrl-C to terminate...')
  })
}
