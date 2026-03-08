import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameLogTable1772928000000 implements MigrationInterface {
  name = 'AddGameLogTable1772928000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`gameLogs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`gameId\` int NOT NULL, \`message\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameLogs\` ADD CONSTRAINT \`FK_gameLogs_gameId\` FOREIGN KEY (\`gameId\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameLogs\` DROP FOREIGN KEY \`FK_gameLogs_gameId\``);
    await queryRunner.query(`DROP TABLE \`gameLogs\``);
  }
}
