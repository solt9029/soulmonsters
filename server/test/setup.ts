import * as dotenv from 'dotenv';
import * as path from 'path';
import { createConnection, Connection } from 'typeorm';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

let connection: Connection;

beforeAll(async () => {
  // Check if MySQL is available, fallback to SQLite in-memory for CI
  const useSQLite = process.env.CI === 'true' || !process.env.DB_HOST;

  if (useSQLite) {
    connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: [path.resolve(__dirname, '../src/entities/*.ts')],
      synchronize: true,
      dropSchema: true,
      logging: false,
    });
  } else {
    connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '13307'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [path.resolve(__dirname, '../src/entities/*.ts')],
      synchronize: process.env.DB_SYNCHRONIZE?.toLowerCase() === 'true',
      dropSchema: false,
      logging: false,
    });
  }
});

afterAll(async () => {
  if (connection && connection.isConnected) {
    await connection.close();
  }
});

afterEach(async () => {
  if (connection && connection.isConnected) {
    const entities = connection.entityMetadatas;

    // Handle foreign key constraints differently for MySQL and SQLite
    if (connection.options.type === 'mysql') {
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    } else if (connection.options.type === 'sqlite') {
      await connection.query('PRAGMA foreign_keys = OFF');
    }

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    }

    if (connection.options.type === 'mysql') {
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    } else if (connection.options.type === 'sqlite') {
      await connection.query('PRAGMA foreign_keys = ON');
    }
  }
});
