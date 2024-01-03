import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPartition1704267739056 implements MigrationInterface {
  name = 'CreateUserPartition1704267739056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2024-01-03T07:42:30.547Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2024-01-03T07:42:30.547Z"'`,
    );
    await queryRunner.query(`CREATE INDEX "user_createdAt_idx" ON "user" ("createdAt") `);
    await queryRunner.query(`
        CREATE TABLE "user_partitioned" (
          "id" serial PRIMARY KEY,
          "email" varchar(255) NOT NULL,
          "password" varchar(1000) NOT NULL,
          "isConfirmed" boolean DEFAULT false,
          "fullName" varchar(255),
          "photo" json,
          "phone" varchar(100),
          "jobTitle" varchar(100) DEFAULT 'Unknown',
          "codeSent" varchar,
          "createdAt" timestamptz DEFAULT current_timestamp,
          "updatedAt" timestamptz DEFAULT current_timestamp
        )
      `);

    await queryRunner.query(`
        CREATE TABLE "user_2023_11" (
          CHECK ( "createdAt" >= '2023-11-01' AND "createdAt" < '2023-12-01' )
        ) INHERITS ("user_partitioned")
      `);

    await queryRunner.query(`
        CREATE TABLE "user_2023_12" (
          CHECK ( "createdAt" >= '2023-12-01' AND "createdAt" < '2024-01-01' )
        ) INHERITS ("user_partitioned")
      `);

    await queryRunner.query(`
      CREATE TABLE "user_2024_01" (
          CHECK ( "createdAt" >= '2024-01-01' AND "createdAt" < '2024-02-01' )
        ) INHERITS ("user_partitioned")
      `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION user_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
      IF NEW."createdAt" >= '2023-11-01' AND NEW."createdAt" < '2023-12-01' THEN
          INSERT INTO "user_2023_11" VALUES (NEW.*);
      ELSIF NEW."createdAt" >= '2023-12-01' AND NEW."createdAt" < '2024-01-01' THEN
          INSERT INTO "user_2023_12" VALUES (NEW.*);
      ELSIF NEW."createdAt" >= '2024-01-01' AND NEW."createdAt" < '2024-02-01' THEN
          INSERT INTO "user_2024_01" VALUES (NEW.*);
      ELSE
          RAISE EXCEPTION 'Date out of range!';
      END IF;
    
      RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
        CREATE TRIGGER user_insert_trigger
        BEFORE INSERT ON "user"
        FOR EACH ROW EXECUTE FUNCTION user_insert_trigger();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_createdAt_idx"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-28 18:00:56.382+02'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-28 18:00:56.382+02'`,
    );
    await queryRunner.query('DROP TRIGGER IF EXISTS user_insert_trigger ON "user_partitioned"');
    await queryRunner.query('DROP FUNCTION IF EXISTS user_insert_trigger()');
    await queryRunner.query('DROP TABLE IF EXISTS "user_2023_11"');
    await queryRunner.query('DROP TABLE IF EXISTS "user_2023_12"');
    await queryRunner.query('DROP TABLE IF EXISTS "user_2024_01"');
    await queryRunner.query('DROP TABLE IF EXISTS "user_partitioned"');
  }
}
