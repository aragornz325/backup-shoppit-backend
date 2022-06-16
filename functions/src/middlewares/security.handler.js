// const Redis = require('ioredis');
// const redisClient = new Redis({ enableOfflineQueue: true });
// const boom = require('@hapi/boom');

// const rateLimiterRedis = new rateLimiterRedis({
//   storeClient: redisClient,
//   points: 10,
//   duration: 1,
// });

// const rateLimiterMiddleware = (req, res, next) => {
//   rateLimiterRedis
//     .consume(req.ip)
//     .then(() => {
//       next();
//     })
//     .catch((_) => {
//       throw boom.tooManyRequests('too many requests');
//     });
// };

// module.exports = { rateLimiterMiddleware };
