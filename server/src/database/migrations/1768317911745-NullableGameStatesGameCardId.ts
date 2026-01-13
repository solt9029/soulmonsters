import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableGameStatesGameCardId1768317911745 implements MigrationInterface {
  name = 'NullableGameStatesGameCardId1768317911745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_741d94d1201afdd81dae35eccc\` ON \`gameCards\``);
    await queryRunner.query(`ALTER TABLE \`gameStates\` DROP FOREIGN KEY \`FK_7d035df69448fca8d246e6147e2\``);
    await queryRunner.query(`ALTER TABLE \`gameStates\` CHANGE \`gameCardId\` \`gameCardId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`gameStates\` ADD CONSTRAINT \`FK_7d035df69448fca8d246e6147e2\` FOREIGN KEY (\`gameCardId\`) REFERENCES \`gameCards\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameStates\` DROP FOREIGN KEY \`FK_7d035df69448fca8d246e6147e2\``);
    await queryRunner.query(`ALTER TABLE \`gameStates\` CHANGE \`gameCardId\` \`gameCardId\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`gameStates\` ADD CONSTRAINT \`FK_7d035df69448fca8d246e6147e2\` FOREIGN KEY (\`gameCardId\`) REFERENCES \`gameCards\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_741d94d1201afdd81dae35eccc\` ON \`gameCards\` (\`position\`, \`zone\`, \`currentUserId\`)`,
    );
  }
}
