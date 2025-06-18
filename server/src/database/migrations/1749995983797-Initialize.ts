import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1749995983797 implements MigrationInterface {
  name = 'Initialize1749995983797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `gameCards` (`id` int NOT NULL AUTO_INCREMENT, `originalUserId` varchar(255) NOT NULL, `currentUserId` varchar(255) NOT NULL, `zone` varchar(255) NOT NULL, `position` int NOT NULL, `battlePosition` varchar(255) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `cardId` int NULL, `gameId` int NULL, UNIQUE INDEX `IDX_741d94d1201afdd81dae35eccc` (`position`, `zone`, `currentUserId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `gameStates` (`id` int NOT NULL AUTO_INCREMENT, `state` json NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `gameId` int NOT NULL, `gameCardId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `games` (`id` int NOT NULL AUTO_INCREMENT, `turnUserId` varchar(255) NULL, `phase` varchar(255) NULL, `winnerUserId` varchar(255) NULL, `turnCount` int NOT NULL DEFAULT 0, `startedAt` datetime NULL, `endedAt` datetime NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `gameUsers` (`id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `energy` int NULL, `lifePoint` int NOT NULL DEFAULT 8000, `lastViewedAt` datetime NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deckId` int NULL, `gameId` int NULL, UNIQUE INDEX `IDX_52a96d957f59a6e11a76fd9f15` (`deckId`, `gameId`), UNIQUE INDEX `IDX_65236f59399a6fe1e89c392d6c` (`userId`, `gameId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `decks` (`id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `name` varchar(64) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `deckCards` (`id` int NOT NULL AUTO_INCREMENT, `count` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `cardId` int NULL, `deckId` int NULL, UNIQUE INDEX `IDX_7cf4fca9445dfa0f5247ec78d7` (`cardId`, `deckId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `cards` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `kind` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `attribute` varchar(255) NULL, `attack` int NULL, `defence` int NULL, `cost` int NULL, `detail` text NULL, `picture` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `gameCards` ADD CONSTRAINT `FK_12fe977b2121f39769a24e28923` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `gameCards` ADD CONSTRAINT `FK_a19cbc424172d0e792c89a2603e` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `gameStates` ADD CONSTRAINT `FK_144387f1094beb080d9cf0c5036` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `gameStates` ADD CONSTRAINT `FK_7d035df69448fca8d246e6147e2` FOREIGN KEY (`gameCardId`) REFERENCES `gameCards`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `gameUsers` ADD CONSTRAINT `FK_53bd8bf8475ab3cb883ba3fb0eb` FOREIGN KEY (`deckId`) REFERENCES `decks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `gameUsers` ADD CONSTRAINT `FK_3bfa9c030d76978b74ef2a329c0` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `deckCards` ADD CONSTRAINT `FK_f6ec9673aa14e8b3e34c8572ffd` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `deckCards` ADD CONSTRAINT `FK_2f311ec3f91467ed53191796250` FOREIGN KEY (`deckId`) REFERENCES `decks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `deckCards` DROP FOREIGN KEY `FK_2f311ec3f91467ed53191796250`', undefined);
    await queryRunner.query('ALTER TABLE `deckCards` DROP FOREIGN KEY `FK_f6ec9673aa14e8b3e34c8572ffd`', undefined);
    await queryRunner.query('ALTER TABLE `gameUsers` DROP FOREIGN KEY `FK_3bfa9c030d76978b74ef2a329c0`', undefined);
    await queryRunner.query('ALTER TABLE `gameUsers` DROP FOREIGN KEY `FK_53bd8bf8475ab3cb883ba3fb0eb`', undefined);
    await queryRunner.query('ALTER TABLE `gameStates` DROP FOREIGN KEY `FK_7d035df69448fca8d246e6147e2`', undefined);
    await queryRunner.query('ALTER TABLE `gameStates` DROP FOREIGN KEY `FK_144387f1094beb080d9cf0c5036`', undefined);
    await queryRunner.query('ALTER TABLE `gameCards` DROP FOREIGN KEY `FK_a19cbc424172d0e792c89a2603e`', undefined);
    await queryRunner.query('ALTER TABLE `gameCards` DROP FOREIGN KEY `FK_12fe977b2121f39769a24e28923`', undefined);
    await queryRunner.query('DROP TABLE `cards`', undefined);
    await queryRunner.query('DROP INDEX `IDX_7cf4fca9445dfa0f5247ec78d7` ON `deckCards`', undefined);
    await queryRunner.query('DROP TABLE `deckCards`', undefined);
    await queryRunner.query('DROP TABLE `decks`', undefined);
    await queryRunner.query('DROP INDEX `IDX_65236f59399a6fe1e89c392d6c` ON `gameUsers`', undefined);
    await queryRunner.query('DROP INDEX `IDX_52a96d957f59a6e11a76fd9f15` ON `gameUsers`', undefined);
    await queryRunner.query('DROP TABLE `gameUsers`', undefined);
    await queryRunner.query('DROP TABLE `games`', undefined);
    await queryRunner.query('DROP TABLE `gameStates`', undefined);
    await queryRunner.query('DROP INDEX `IDX_741d94d1201afdd81dae35eccc` ON `gameCards`', undefined);
    await queryRunner.query('DROP TABLE `gameCards`', undefined);
  }
}
