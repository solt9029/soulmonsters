import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisplayNameToGameUsers1772928000001 implements MigrationInterface {
  name = 'AddDisplayNameToGameUsers1772928000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameUsers\` ADD \`displayName\` varchar(255) NOT NULL DEFAULT 'ユーザー1'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameUsers\` DROP COLUMN \`displayName\``);
  }
}
