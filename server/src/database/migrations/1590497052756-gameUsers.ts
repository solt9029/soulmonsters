import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameUsers1590497052756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE gameUsers (
        id int(11) NOT NULL AUTO_INCREMENT,
        userId varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        energy int(11) DEFAULT NULL,
        lifePoint int(11) NOT NULL DEFAULT '8000',
        lastViewedAt datetime NOT NULL,
        deckId int(11) DEFAULT NULL,
        gameId int(11) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY IDX_eea2633c74cc717f212a9ba6c7 (deckId,gameId),
        UNIQUE KEY IDX_d05c745353b36c855f6e14179c (userId,gameId),
        KEY FK_e987db4cbe03070958e54074005 (gameId),
        CONSTRAINT FK_e987db4cbe03070958e54074005 FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_ee5da30384a20252517bdf07855 FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE gameUsers`);
  }
}
