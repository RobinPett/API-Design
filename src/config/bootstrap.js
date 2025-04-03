import { IoCContainer } from '../lib/IoCContainer.js'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import { AuthProvider } from '../lib/AuthProvider.js'

import { GameRepository } from '../repositories/GameRepository.js'
import { GameService } from '../services/GameService.js'
import { GameModel } from '../models/GameModel.js'

import { DeveloperRepository } from '../repositories/DeveloperRepository.js'
import { DeveloperService } from '../services/DeveloperService.js'
import { DeveloperModel } from '../models/DeveloperModel.js'

import { RatingModel } from '../models/RatingModel.js'
import { RatingRepository } from '../repositories/RatingRepository.js'
import { RatingService } from '../services/RatingService.js'

import { GenreModel } from '../models/GenreModel.js'
import { GenreRepository } from '../repositories/GenreRepository.js'
import { GenreService } from '../services/GenreService.js'

import { PlatformModel } from '../models/PlatformModel.js'
import { PlatformRepository } from '../repositories/PlatformRepository.js'
import { PlatformService } from '../services/PlatformService.js'

import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'

const iocContainer = new IoCContainer()

// Registering the modules in the IoC container

// JWT Service
iocContainer.register('jwtService', new JsonWebToken(process.env.JWT_SECRET, process.env.JWT_EXPIRATION), { singleton: true })

// Auth Middleware
iocContainer.register('AuthProvider', AuthProvider, { singleton: true })

// User modules
iocContainer.register('UserModel', UserModel, { type: true })
iocContainer.register('UserRepository', UserRepository, { dependencies: ['UserModel'], singleton: true })
iocContainer.register('UserService', UserService, { dependencies: ['UserRepository', 'jwtService'], singleton: true })

// Platform Modules
iocContainer.register('PlatformModel', PlatformModel, { type: true })
iocContainer.register('PlatformRepository', PlatformRepository, { dependencies: ['PlatformModel'], singleton: true })
iocContainer.register('PlatformService', PlatformService, { dependencies: ['PlatformRepository'], singleton: true })

// Rating Modules
iocContainer.register('RatingModel', RatingModel, { type: true })
iocContainer.register('RatingRepository', RatingRepository, { dependencies: ['RatingModel'], singleton: true })
iocContainer.register('RatingService', RatingService, { dependencies: ['RatingRepository'], singleton: true })

// Genre Modules
iocContainer.register('GenreModel', GenreModel, { type: true })
iocContainer.register('GenreRepository', GenreRepository, { dependencies: ['GenreModel'], singleton: true })
iocContainer.register('GenreService', GenreService, { dependencies: ['GenreRepository'], singleton: true })

// Developer Modules
iocContainer.register('DeveloperModel', DeveloperModel, { type: true })
iocContainer.register('DeveloperRepository', DeveloperRepository, { dependencies: ['DeveloperModel'], singleton: true })
iocContainer.register('DeveloperService', DeveloperService, { dependencies: ['DeveloperRepository'], singleton: true })

// Game Modules
iocContainer.register('GameModel', GameModel, { type: true })
iocContainer.register('GameRepository', GameRepository, { dependencies: ['GameModel'], singleton: true })
iocContainer.register('GameService', GameService, { dependencies: ['GameRepository', 'PlatformService', 'GenreService', 'RatingService', 'DeveloperService', 'UserService'], singleton: true, })

export const container = Object.freeze(iocContainer)