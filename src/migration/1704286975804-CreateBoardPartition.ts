import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardPartition1704286975804 implements MigrationInterface {
  name = 'CreateBoardPartition1704286975804';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2024-01-03T13:03:00.416Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2024-01-03T13:03:00.416Z"'`,
    );
    await queryRunner.query(`CREATE INDEX "board_isClosed_idx" ON "board" ("isClosed") `);

    await queryRunner.query(`
      CREATE TABLE "board_partitioned" (
        "id" serial PRIMARY KEY,
        "name" varchar(150),
        "isPublic" boolean DEFAULT false,
        "isClosed" boolean DEFAULT false,
        "createdDate" timestamptz DEFAULT current_timestamp
      )
    `);

    await queryRunner.query(`
    CREATE TABLE "board_closed" (
        CHECK ( "isClosed" = true )
    ) INHERITS ("board_partitioned")
  `);

    await queryRunner.query(`
    CREATE TABLE "board_open" (
        CHECK ( "isClosed" = false )
    ) INHERITS ("board_partitioned")
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."board_isClosed_idx"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2024-01-03 09:42:30.547+02'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2024-01-03 09:42:30.547+02'`,
    );
    await queryRunner.query(`DROP TABLE "board_open"`);
    await queryRunner.query(`DROP TABLE "board_closed"`);
    await queryRunner.query(`DROP TABLE "board_partitioned"`);
  }
}
