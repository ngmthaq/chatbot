import dayjs from 'dayjs';

export const config = () => ({
  // MYSQL_USER
  databaseUser: process.env.MYSQL_USER || 'app_user',

  // MYSQL_PASSWORD
  databasePassword: process.env.MYSQL_PASSWORD || 'app_password',

  // MYSQL_HOST
  databaseHost: process.env.MYSQL_HOST || 'localhost',

  // MYSQL_PORT
  databasePort: parseInt(process.env.MYSQL_PORT, 10) || 3306,

  // MYSQL_DATABASE
  databaseName: process.env.MYSQL_DATABASE || 'app_db',

  // MYSQL_ROOT_PASSWORD
  databaseRootPassword: process.env.MYSQL_ROOT_PASSWORD || 'root',

  // MESSAGE_QUEUE_REDIS_HOST
  messageQueueRedisHost: process.env.MESSAGE_QUEUE_REDIS_HOST || 'localhost',

  // MESSAGE_QUEUE_REDIS_PORT
  messageQueueRedisPort:
    parseInt(process.env.MESSAGE_QUEUE_REDIS_PORT, 10) || 6378,

  // CACHE_REDIS_HOST
  cacheRedisHost: process.env.CACHE_REDIS_HOST || 'localhost',

  // CACHE_REDIS_PORT
  cacheRedisPort: parseInt(process.env.CACHE_REDIS_PORT, 10) || 6379,

  // NEST_APP_PORT
  port: parseInt(process.env.NEST_APP_PORT, 10) || 3000,

  // NEST_APP_CACHE_TTL
  cacheTtl: parseInt(process.env.NEST_APP_CACHE_TTL, 10) || 60000,

  // NEST_APP_CACHE_LRU_SIZE
  cacheLruSize: parseInt(process.env.NEST_APP_CACHE_LRU_SIZE, 10) || 5000,

  // NEST_APP_CRYPTO_ALGORITHM
  cryptoAlgorithm: process.env.NEST_APP_CRYPTO_ALGORITHM || 'aes-256-cbc',

  // NEST_APP_CRYPTO_SECRET
  cryptoSecret: process.env.NEST_APP_CRYPTO_SECRET || 'your-secret-key',

  // NEST_APP_SALT_ROUNDS
  saltRounds: parseInt(process.env.NEST_APP_SALT_ROUNDS, 10) || 10,

  // NEST_APP_JWT_SECRET
  jwtSecret: process.env.NEST_APP_JWT_SECRET || 'your-jwt-secret',

  // NEST_APP_JWT_EXPIRATION
  jwtExpiration: process.env.NEST_APP_JWT_EXPIRATION || '1H',

  // NEST_APP_RT_EXPIRATION_NUMBER
  refreshTokenExpirationNumber:
    parseInt(process.env.NEST_APP_RT_EXPIRATION_NUMBER, 10) || 30,

  // NEST_APP_RT_EXPIRATION_UNIT
  refreshTokenExpirationUnit: process.env.NEST_APP_RT_EXPIRATION_UNIT || 'days',

  // Refresh token expiration date
  refreshTokenExpiration: () => {
    return dayjs()
      .add(
        parseInt(process.env.NEST_APP_RT_EXPIRATION_NUMBER, 10) || 30,
        (process.env.NEST_APP_RT_EXPIRATION_UNIT ||
          'days') as dayjs.ManipulateType,
      )
      .toDate();
  },

  // NEST_APP_AT_EXPIRATION_NUMBER
  activationTokenExpirationNumber:
    parseInt(process.env.NEST_APP_AT_EXPIRATION_NUMBER, 10) || 1,

  // NEST_APP_AT_EXPIRATION_UNIT
  activationTokenExpirationUnit:
    process.env.NEST_APP_AT_EXPIRATION_UNIT || 'days',

  // Activation token expiration date
  activationTokenExpiration: () => {
    return dayjs()
      .add(
        parseInt(process.env.NEST_APP_AT_EXPIRATION_NUMBER, 10) || 1,
        (process.env.NEST_APP_AT_EXPIRATION_UNIT ||
          'days') as dayjs.ManipulateType,
      )
      .toDate();
  },

  // NEST_APP_RPT_EXPIRATION_NUMBER
  resetPasswordTokenExpirationNumber:
    parseInt(process.env.NEST_APP_RPT_EXPIRATION_NUMBER, 10) || 1,

  // NEST_APP_RPT_EXPIRATION_UNIT
  resetPasswordTokenExpirationUnit:
    process.env.NEST_APP_RPT_EXPIRATION_UNIT || 'hours',

  // Reset password token expiration date
  resetPasswordTokenExpiration: () => {
    return dayjs()
      .add(
        parseInt(process.env.NEST_APP_RPT_EXPIRATION_NUMBER, 10) || 1,
        (process.env.NEST_APP_RPT_EXPIRATION_UNIT ||
          'hours') as dayjs.ManipulateType,
      )
      .toDate();
  },
});
