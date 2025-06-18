const env = require('dotenv').config({ path: require('path').resolve(__dirname, './.env.test') });

const { DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_SYNCHRONIZE } = env.parsed;

module.exports = {
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: DB_SYNCHRONIZE?.toLowerCase() === 'true',
  logging: false,
  entities: ['src/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/database/migrations',
  },
};
