module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'f0836286dfe888e1dca376647ad0d845'),
    },
  },
  settings: {
    cors: {
      enabled: true,
      origin: ['*'],
      headers: ['*'],
    },
  },
});
