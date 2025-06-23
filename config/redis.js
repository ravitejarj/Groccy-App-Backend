const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error', err);
});

client.on('connect', () => {
  console.log('✅ Redis connected');
});

client.connect(); // Important for Redis v4+

module.exports = client;
