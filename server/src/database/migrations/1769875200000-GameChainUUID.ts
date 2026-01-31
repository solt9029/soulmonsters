import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameChainUUID1769875200000 implements MigrationInterface {
  name = 'GameChainUUID1769875200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` DROP FOREIGN KEY \`FK_cce6f9e9c746feb8fa3ae04a772\``);

    await queryRunner.query(`ALTER TABLE \`gameChains\` MODIFY \`id\` varchar(36) NOT NULL`);

    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` MODIFY \`id\` varchar(36) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` MODIFY \`gameChainId\` varchar(36) NOT NULL`);

    await queryRunner.query(
      `ALTER TABLE \`gameChainLinks\` ADD CONSTRAINT \`FK_cce6f9e9c746feb8fa3ae04a772\` FOREIGN KEY (\`gameChainId\`) REFERENCES \`gameChains\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` DROP FOREIGN KEY \`FK_cce6f9e9c746feb8fa3ae04a772\``);

    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` MODIFY \`gameChainId\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`gameChainLinks\` MODIFY \`id\` int NOT NULL AUTO_INCREMENT`);

    await queryRunner.query(`ALTER TABLE \`gameChains\` MODIFY \`id\` int NOT NULL AUTO_INCREMENT`);

    await queryRunner.query(
      `ALTER TABLE \`gameChainLinks\` ADD CONSTRAINT \`FK_cce6f9e9c746feb8fa3ae04a772\` FOREIGN KEY (\`gameChainId\`) REFERENCES \`gameChains\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
