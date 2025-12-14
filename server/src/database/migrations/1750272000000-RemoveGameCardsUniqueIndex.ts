import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * GameModelに紐づく複数のGameCardModelについて、BulkUpdateで同時にpositionやzoneなどを更新しようとすると、DB上の古いデータと衝突してunique制約違反と判定されてしまう
 * position, zone, currentUserIdの組み合わせに対するunique制約はアプリケーション上で担保することにする
 */
export class RemoveGameCardsUniqueIndex1750272000000 implements MigrationInterface {
  name = 'RemoveGameCardsUniqueIndex1750272000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_741d94d1201afdd81dae35eccc` ON `gameCards`', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_741d94d1201afdd81dae35eccc` ON `gameCards` (`position`, `zone`, `currentUserId`)',
      undefined,
    );
  }
}
