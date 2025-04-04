/**
 * Congifuration for Mercurious
 * @module mercurious
 */

import { container } from './bootstrap.js'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'

// Errors
import { AuthorizationError } from '../lib/errors/AuthorizationError.js'
import { DuplicationError } from '../lib/errors/DuplicationError.js'

// Schemas
import { gameSchema} from '../schemas/gameSchema.js'
import { developerSchema} from '../schemas/developerSchema.js'
import { ratingSchema } from '../schemas/ratingSchema.js'
import { genreSchema } from '../schemas/genreSchema.js'
import { platformSchema } from '../schemas/platformSchema.js'
import { userSchema } from '../schemas/userSchema.js'

// Resolvers
import { gameResolvers } from '../resolvers/gameResolver.js'
import { developerResolvers } from '../resolvers/developerResolver.js'
import { ratingResolvers } from '../resolvers/ratingResolver.js'
import { genreResolvers } from '../resolvers/genreResolver.js'
import { platformResolvers } from '../resolvers/platformResolver.js'
import { userResolvers } from '../resolvers/userResolver.js'


const typeDefs = mergeTypeDefs([gameSchema, developerSchema, ratingSchema, genreSchema, platformSchema, userSchema])
const resolvers = [gameResolvers, developerResolvers, ratingResolvers, genreResolvers, platformResolvers, userResolvers]

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export const mercuriousConfig = {
  schema,
  graphiql: true,
  context: async (request, reply) => ({ 
    container, 
    user: await authorize(request, reply) 
  }),
  // TODO: Move to plugin?
    errorFormatter: (execution, context) => {
      const { errors, data } = execution
      console.error(errors)
      // const statusCode = errors.some(e => e.originalError.statusCode) || 500
      const statusCode = errors.some(e => e.originalError instanceof  DuplicationError || e.code === 'DUPLICATION_ERROR')
        ? 409
        : errors.some(e => e.originalError instanceof AuthorizationError || e.code === 'UNAUTHENTICATED') 
        ? 401 
        : 400
  
      return {
        statusCode,
        response: {
          errors: errors.map(error => ({
            message: error.message,
            code: error.originalError.name || error.code || 'INTERNAL_SERVER_ERROR',
            path: error.path
          })),
          data,
          extensions: {
            service: 'game-api-service',
            timestamp: new Date().toISOString()
          }
        }
      }
    },
    hooks: {
      onError: (schema, source, context, errors) => {
        errors.forEach(error => {
          fastify.log.error({
            error: error.originalError,
            query: context.reply.request.body.query
          })
        })
      }
    }
  }

// TODO: Document
// Extract token and authorize user
function authorize(request, reply) {
  try {
    const authorizationHeader = request.headers['authorization'] || ''
    const token = authorizationHeader.replace('Bearer ', '').trim()
    
    if (token) {
      request.user = container.resolve('UserService').authorize(token)
    } else {
      request.user = null
    }
    return request.user
  } catch (error) {
    throw new AuthorizationError('Failed to authorize user')
  }
}
