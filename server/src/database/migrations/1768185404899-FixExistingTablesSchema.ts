import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixExistingTablesSchema1768185404899 implements MigrationInterface {
  name = 'FixExistingTablesSchema1768185404899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`gameUsers\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`decks\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`deckCards\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`gameCards\` DROP FOREIGN KEY \`FK_12fe977b2121f39769a24e28923\``);
    await queryRunner.query(
      `ALTER TABLE \`gameCards\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`gameCards\` CHANGE \`cardId\` \`cardId\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`gameStates\` DROP FOREIGN KEY \`FK_7d035df69448fca8d246e6147e2\``);
    await queryRunner.query(`ALTER TABLE \`gameStates\` CHANGE \`gameCardId\` \`gameCardId\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`gameStates\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_741d94d1201afdd81dae35eccc\` ON \`gameCards\` (\`position\`, \`zone\`, \`currentUserId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameCards\` ADD CONSTRAINT \`FK_12fe977b2121f39769a24e28923\` FOREIGN KEY (\`cardId\`) REFERENCES \`cards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameStates\` ADD CONSTRAINT \`FK_7d035df69448fca8d246e6147e2\` FOREIGN KEY (\`gameCardId\`) REFERENCES \`gameCards\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameStates\` DROP FOREIGN KEY \`FK_7d035df69448fca8d246e6147e2\``);
    await queryRunner.query(`ALTER TABLE \`gameCards\` DROP FOREIGN KEY \`FK_12fe977b2121f39769a24e28923\``);
    await queryRunner.query(`DROP INDEX \`IDX_741d94d1201afdd81dae35eccc\` ON \`gameCards\``);
    await queryRunner.query(
      `ALTER TABLE \`games\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameStates\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`gameStates\` CHANGE \`gameCardId\` \`gameCardId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`gameStates\` ADD CONSTRAINT \`FK_7d035df69448fca8d246e6147e2\` FOREIGN KEY (\`gameCardId\`) REFERENCES \`gameCards\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`gameCards\` CHANGE \`cardId\` \`cardId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`gameCards\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameCards\` ADD CONSTRAINT \`FK_12fe977b2121f39769a24e28923\` FOREIGN KEY (\`cardId\`) REFERENCES \`cards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`deckCards\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`decks\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameUsers\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
