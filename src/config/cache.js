/**
 * Congifuration for Mercurious cache
 * @module cacheConfig
 */

export const cacheConfig = {
  ttl: 60, // Cache for 60 seconds
  policy: {
    Query: {
      games: true,
      ratings: true,
      platforms: true,
    }
  }
}
