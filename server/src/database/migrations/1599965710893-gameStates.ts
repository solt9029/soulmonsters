import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameStates1599965710893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE gameStates (
        id int(11) NOT NULL AUTO_INCREMENT,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        gameId int(11) NOT NULL,
        gameCardId int(11) DEFAULT NULL,
        state json NOT NULL,
        PRIMARY KEY (id),
        KEY FK_144387f1094beb080d9cf0c5036 (gameId),
        KEY FK_7d035df69448fca8d246e6147e2 (gameCardId),
        CONSTRAINT FK_144387f1094beb080d9cf0c5036 FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_7d035df69448fca8d246e6147e2 FOREIGN KEY (gameCardId) REFERENCES gameCards (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE gameStates`);
  }
}
