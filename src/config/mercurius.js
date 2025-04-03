/**
 * Congifuration for Mercurious
 * @module mercurious
 */

import { container } from './bootstrap.js'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'

// Errors
import { AuthorizationError } from '../lib/errors/AuthorizationError.js'

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
  errorFormatter: (result) => {
    
    // Extract original error since Mercurius wraps it in a new error
    const originalError = result.errors[0]

    console.log('Original error:', originalError)
    const { message, path } = originalError

    if (originalError instanceof AuthorizationError) {
      const code = originalError.statusCode || 401
      return {
        statusCode: code,
        response: { errors: [{ message, path }] }
      }
    }

    // Default error handling
    return {
      statusCode: 500,
      response: { errors: [{ message, path }] }
    }
  }
}

// TODO: Add error handling for authorization
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