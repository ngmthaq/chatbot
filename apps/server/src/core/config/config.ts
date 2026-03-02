import dayjs from 'dayjs';

export const config = () => ({
  // MYSQL_USER
  databaseUser: process.env.MYSQL_USER || 'app_user',

  // MYSQL_PASSWORD
  databasePassword: process.env.MYSQL_PASSWORD || 'app_password',

  // MYSQL_HOST
  databaseHost: process.env.MYSQL_HOST || 'localhost',

  // MYSQL_PORT
  databasePort: parseInt(process.env.MYSQL_PORT!, 10) || 3306,

  // MYSQL_DATABASE
  databaseName: process.env.MYSQL_DATABASE || 'app_db',

  // MYSQL_ROOT_PASSWORD
  databaseRootPassword: process.env.MYSQL_ROOT_PASSWORD || 'root',

  // DATABASE_URL (constructed from database config)
  databaseUrl: () => {
    const user = process.env.MYSQL_USER || 'app_user';
    const password = process.env.MYSQL_PASSWORD || 'app_password';
    const host = process.env.MYSQL_HOST || 'localhost';
    const port = parseInt(process.env.MYSQL_PORT!, 10) || 3306;
    const database = process.env.MYSQL_DATABASE || 'app_db';
    return `mysql://${user}:${password}@${host}:${port}/${database}`;
  },

  // MESSAGE_QUEUE_REDIS_HOST
  messageQueueRedisHost: process.env.MESSAGE_QUEUE_REDIS_HOST || 'localhost',

  // MESSAGE_QUEUE_REDIS_PORT
  messageQueueRedisPort:
    parseInt(process.env.MESSAGE_QUEUE_REDIS_PORT!, 10) || 6378,

  // CACHE_REDIS_HOST
  cacheRedisHost: process.env.CACHE_REDIS_HOST || 'localhost',

  // CACHE_REDIS_PORT
  cacheRedisPort: parseInt(process.env.CACHE_REDIS_PORT!, 10) || 6379,

  // OLLAMA_HOST
  ollamaHost: process.env.OLLAMA_HOST || 'localhost',

  // OLLAMA_PORT
  ollamaPort: parseInt(process.env.OLLAMA_PORT!, 10) || 11434,

  // OLLAMA_CHAT_MODEL
  ollamaChatModel: process.env.OLLAMA_CHAT_MODEL || 'llama3',

  // OLLAMA_EMBED_MODEL
  ollamaEmbedModel: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',

  // OLLAMA_VISION_MODEL
  ollamaVisionModel: process.env.OLLAMA_VISION_MODEL || 'llava',

  // OLLAMA_URL (constructed from host and port)
  ollamaUrl: () => {
    const host = process.env.OLLAMA_HOST || 'localhost';
    const port = parseInt(process.env.OLLAMA_PORT!, 10) || 11434;
    return `http://${host}:${port}`;
  },

  // QDRANT_HOST
  qdrantHost: process.env.QDRANT_HOST || 'localhost',

  // QDRANT_PORT
  qdrantPort: parseInt(process.env.QDRANT_PORT!, 10) || 6333,

  // QDRANT_URL (constructed from host and port)
  qdrantUrl: () => {
    const host = process.env.QDRANT_HOST || 'localhost';
    const port = parseInt(process.env.QDRANT_PORT!, 10) || 6333;
    return `http://${host}:${port}`;
  },

  // QDRANT_API_KEY
  qdrantApiKey: process.env.QDRANT_API_KEY || '',

  // DEFAULT_CONTEXT_WINDOW
  defaultContextWindow: parseInt(process.env.DEFAULT_CONTEXT_WINDOW!, 10) || 20,

  // DEFAULT_TEMPERATURE
  defaultTemperature: parseFloat(process.env.DEFAULT_TEMPERATURE!) || 0.7,

  // DEFAULT_MAX_TOKENS
  defaultMaxTokens: parseInt(process.env.DEFAULT_MAX_TOKENS!, 10) || 2048,

  // UPLOAD_DIR
  uploadDir: process.env.UPLOAD_DIR || './uploads',

  // MAX_FILE_SIZE
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE!, 10) || 52428800,

  // NEST_APP_PORT
  port: parseInt(process.env.NEST_APP_PORT!, 10) || 3000,

  // NEST_APP_NAME
  appName: process.env.NEST_APP_NAME || 'Chatbot App',

  // NEST_APP_CLIENT_URL
  appClientUrl: process.env.NEST_APP_CLIENT_URL || 'http://localhost:3000',

  // NEST_APP_CACHE_TTL
  cacheTtl: parseInt(process.env.NEST_APP_CACHE_TTL!, 10) || 60000,

  // NEST_APP_CACHE_LRU_SIZE
  cacheLruSize: parseInt(process.env.NEST_APP_CACHE_LRU_SIZE!, 10) || 5000,

  // NEST_APP_CRYPTO_ALGORITHM
  cryptoAlgorithm: process.env.NEST_APP_CRYPTO_ALGORITHM || 'aes-256-cbc',

  // NEST_APP_CRYPTO_SECRET
  cryptoSecret: process.env.NEST_APP_CRYPTO_SECRET || 'your-secret-key',

  // NEST_APP_SALT_ROUNDS
  saltRounds: parseInt(process.env.NEST_APP_SALT_ROUNDS!, 10) || 10,

  // NEST_APP_JWT_SECRET
  jwtSecret: process.env.NEST_APP_JWT_SECRET || 'your-jwt-secret',

  // NEST_APP_JWT_EXPIRATION
  jwtExpiration: process.env.NEST_APP_JWT_EXPIRATION || '1H',

  // NEST_APP_RT_EXPIRATION_NUMBER
  refreshTokenExpirationNumber:
    parseInt(process.env.NEST_APP_RT_EXPIRATION_NUMBER!, 10) || 30,

  // NEST_APP_RT_EXPIRATION_UNIT
  refreshTokenExpirationUnit: process.env.NEST_APP_RT_EXPIRATION_UNIT || 'days',

  // Refresh token expiration date
  refreshTokenExpiration: () => {
    return dayjs()
      .add(
        parseInt(process.env.NEST_APP_RT_EXPIRATION_NUMBER!, 10) || 30,
        (process.env.NEST_APP_RT_EXPIRATION_UNIT ||
          'days') as dayjs.ManipulateType,
      )
      .toDate();
  },

  // NEST_APP_AT_EXPIRATION_NUMBER
  activationTokenExpirationNumber:
    parseInt(process.env.NEST_APP_AT_EXPIRATION_NUMBER!, 10) || 1,

  // NEST_APP_AT_EXPIRATION_UNIT
  activationTokenExpirationUnit:
    process.env.NEST_APP_AT_EXPIRATION_UNIT || 'days',

  // Activation token expiration date
  activationTokenExpiration: () => {
    return dayjs()
      .add(
        parseInt(process.env.NEST_APP_AT_EXPIRATION_NUMBER!, 10) || 1,
        (process.env.NEST_APP_AT_EXPIRATION_UNIT ||
          'days') as dayjs.ManipulateType,
      )
      .toDate();
  },

  // NEST_APP_RPT_EXPIRATION_NUMBER
  resetPasswordTokenExpirationNumber:
    parseInt(process.env.NEST_APP_RPT_EXPIRATION_NUMBER!, 10) || 1,

  // NEST_APP_RPT_EXPIRATION_UNIT
  resetPasswordTokenExpirationUnit:
    process.env.NEST_APP_RPT_EXPIRATION_UNIT || 'hours',

  // Reset password token expiration date
  resetPasswordTokenExpiration: () => {
    return dayjs()
      .add(
        parseInt(process.env.NEST_APP_RPT_EXPIRATION_NUMBER!, 10) || 1,
        (process.env.NEST_APP_RPT_EXPIRATION_UNIT ||
          'hours') as dayjs.ManipulateType,
      )
      .toDate();
  },

  // MAIL_MAILER
  mailMailer: process.env.MAIL_MAILER || 'smtp',

  // MAIL_HOST
  mailHost: process.env.MAIL_HOST || 'localhost',

  // MAIL_PORT
  mailPort: parseInt(process.env.MAIL_PORT!, 10) || 587,

  // MAIL_USERNAME
  mailUsername: process.env.MAIL_USERNAME || '',

  // MAIL_PASSWORD
  mailPassword: process.env.MAIL_PASSWORD || '',

  // MAIL_ENCRYPTION
  mailEncryption: process.env.MAIL_ENCRYPTION || 'tls',

  // MAIL_FROM_ADDRESS
  mailFromAddress: process.env.MAIL_FROM_ADDRESS || 'noreply@example.com',

  // MAIL_FROM_NAME
  mailFromName: process.env.MAIL_FROM_NAME || 'Chatbot App',
});
