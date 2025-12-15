const fastify = require('fastify')({ logger: true });

// Hello World route
fastify.get('/', async (request, reply) => {
  return { message: 'We Wish You a Merry Christmas and a Happy New Year!' };
});

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

