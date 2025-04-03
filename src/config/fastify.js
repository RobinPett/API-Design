/**
 * Fastify configuration
 */

export const fastifyConfig = {
    logger: {
        transport: {
            target: 'pino-pretty'
        },
    }
}