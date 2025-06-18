import * as dotenv from 'dotenv';
import * as path from 'path';
import { createConnection, getConnection, Connection } from 'typeorm';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

let connection: Connection;

beforeAll(async () => {
  connection = await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3307'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.resolve(__dirname, '../src/entities/*.ts')],
    synchronize: process.env.DB_SYNCHRONIZE?.toLowerCase() === 'true',
    dropSchema: false,
    logging: false,
  });
});

afterAll(async () => {
  if (connection && connection.isConnected) {
    await connection.close();
  }
});

afterEach(async () => {
  if (connection && connection.isConnected) {
    const entities = connection.entityMetadatas;

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  }
});
