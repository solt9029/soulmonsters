import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChainAndPendingEffectTables1768185404900 implements MigrationInterface {
  name = 'AddChainAndPendingEffectTables1768185404900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`gameChains\` (\`id\` int NOT NULL AUTO_INCREMENT, \`gameId\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`gameChainLinks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`gameChainId\` int NOT NULL, \`orderIndex\` int NOT NULL, \`userId\` varchar(255) NOT NULL, \`gameCardId\` int NULL, \`status\` varchar(255) NOT NULL, \`effect\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`gamePendingEffects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`gameId\` int NOT NULL, \`userId\` varchar(255) NOT NULL, \`gameCardId\` int NULL, \`effectType\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameChains\` ADD CONSTRAINT \`FK_39e747576f1db38982205a4796f\` FOREIGN KEY (\`gameId\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameChainLinks\` ADD CONSTRAINT \`FK_cce6f9e9c746feb8fa3ae04a772\` FOREIGN KEY (\`gameChainId\`) REFERENCES \`gameChains\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gameChainLinks\` ADD CONSTRAINT \`FK_e8013e71035c30cd7d5b8fcb3a6\` FOREIGN KEY (\`gameCardId\`) REFERENCES \`gameCards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gamePendingEffects\` ADD CONSTRAINT \`FK_5c58c04157e290ed9c2635f096f\` FOREIGN KEY (\`gameId\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`gamePendingEffects\` ADD CONSTRAINT \`FK_6637017ec7b423263088cf0039a\` FOREIGN KEY (\`gameCardId\`) REFERENCES \`gameCards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gamePendingEffects\` DROP FOREIGN KEY \`FK_6637017ec7b423263088cf0039a\``);
    await queryRunner.query(`ALTER TABLE \`gamePendingEffects\` DROP FOREIGN KEY \`FK_5c58c04157e290ed9c2635f096f\``);
    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` DROP FOREIGN KEY \`FK_e8013e71035c30cd7d5b8fcb3a6\``);
    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` DROP FOREIGN KEY \`FK_cce6f9e9c746feb8fa3ae04a772\``);
    await queryRunner.query(`ALTER TABLE \`gameChains\` DROP FOREIGN KEY \`FK_39e747576f1db38982205a4796f\``);
    await queryRunner.query(`DROP TABLE \`gamePendingEffects\``);
    await queryRunner.query(`DROP TABLE \`gameChainLinks\``);
    await queryRunner.query(`DROP TABLE \`gameChains\``);
  }
}
