import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeckCards1589634532296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE deckCards (
        id int(11) NOT NULL AUTO_INCREMENT,
        count int(11) NOT NULL,
        cardId int(11) DEFAULT NULL,
        deckId int(11) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY IDX_7cf4fca9445dfa0f5247ec78d7 (cardId,deckId),
        KEY FK_2f311ec3f91467ed53191796250 (deckId),
        CONSTRAINT FK_2f311ec3f91467ed53191796250 FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT FK_f6ec9673aa14e8b3e34c8572ffd FOREIGN KEY (cardId) REFERENCES cards (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE deckCards`);
  }
}
