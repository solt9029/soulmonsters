import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameCards1590497165225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE gameCards (
        id int(11) NOT NULL AUTO_INCREMENT,
        originalUserId varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        currentUserId varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        zone varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        position int(11) NOT NULL,
        battlePosition varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        name varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        kind varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        type varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        attribute varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        attack int(11) DEFAULT NULL,
        defence int(11) DEFAULT NULL,
        cost int(11) DEFAULT NULL,
        detail text COLLATE utf8_unicode_ci,
        cardId int(11) DEFAULT NULL,
        gameId int(11) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY FK_12fe977b2121f39769a24e28923 (cardId),
        KEY FK_a19cbc424172d0e792c89a2603e (gameId),
        CONSTRAINT FK_12fe977b2121f39769a24e28923 FOREIGN KEY (cardId) REFERENCES cards (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT FK_a19cbc424172d0e792c89a2603e FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE gameCards`);
  }
}
