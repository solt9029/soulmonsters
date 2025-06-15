import { MigrationInterface, QueryRunner } from 'typeorm';

export class Games1590496912445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE games (
        id int(11) NOT NULL AUTO_INCREMENT,
        turnUserId varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        phase varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        winnerUserId varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        startedAt datetime DEFAULT NULL,
        endedAt datetime DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        turnCount int(11) NOT NULL DEFAULT '0',
        PRIMARY KEY (id)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE games`);
  }
}
