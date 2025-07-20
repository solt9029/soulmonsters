import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_SYNCHRONIZE } = process.env;

export const AppDataSource = new DataSource({
  type: DB_TYPE as any,
  host: DB_HOST,
  port: parseInt(DB_PORT || '3306'),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: DB_SYNCHRONIZE?.toLowerCase() === 'true',
  logging: true,
  entities: [path.join(__dirname, 'entities/*.{ts,js}')],
  migrations: [path.join(__dirname, 'database/migrations/*.{ts,js}')],
});

AppDataSource.initialize()
  .then(() => {
    console.log('AppDataSource has been initialized!');
  })
  .catch(err => {
    console.error('Error during AppDataSource initialization:', err);
  });
