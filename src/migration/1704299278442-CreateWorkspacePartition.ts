import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkspacePartition1704299278442 implements MigrationInterface {
  name = 'CreateWorkspacePartition1704299278442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "workspace_partitioned" (
          "id" serial PRIMARY KEY,
          "name" varchar(100),
          "type" varchar(50),
          "description" text
        ) PARTITION BY HASH ("id");
    `);

    await queryRunner.query(`
        CREATE TABLE "workspace_1" PARTITION OF "workspace_partitioned" FOR VALUES WITH (MODULUS 3, REMAINDER 0);
    `);

    await queryRunner.query(`
        CREATE TABLE "workspace_2" PARTITION OF "workspace_partitioned" FOR VALUES WITH (MODULUS 3, REMAINDER 1);
    `);

    await queryRunner.query(`
        CREATE TABLE "workspace_3" PARTITION OF "workspace_partitioned" FOR VALUES WITH (MODULUS 3, REMAINDER 2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "workspace_3"`);
    await queryRunner.query(`DROP TABLE "workspace_2"`);
    await queryRunner.query(`DROP TABLE "workspace_1"`);
    await queryRunner.query(`DROP TABLE "workspace_partitioned";`);
  }
}
