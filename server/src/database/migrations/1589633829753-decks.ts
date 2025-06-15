import { MigrationInterface, QueryRunner } from 'typeorm';

export class Decks1589633829753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE decks (
        id int(11) NOT NULL AUTO_INCREMENT,
        userId varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        name varchar(64) COLLATE utf8_unicode_ci NOT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE cards`);
  }
}
