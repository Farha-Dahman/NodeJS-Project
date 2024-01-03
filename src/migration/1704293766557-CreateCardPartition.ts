import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCardPartition1704293766557 implements MigrationInterface {
    name = 'CreateCardPartition1704293766557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "card_partitioned" (
          "id" serial PRIMARY KEY,
          "title" varchar(100),
          "description" text,
          "isArchived" boolean DEFAULT false,
          "dueDate" timestamp,
          "reminderDate" timestamp,
          "createdDate" timestamptz DEFAULT current_timestamp
        )
      `);
  
      await queryRunner.query(`
        CREATE TABLE "card_archived" (
          CHECK ( "isArchived" = true )
        ) INHERITS ("card_partitioned")
      `);
  
      await queryRunner.query(`
        CREATE TABLE "card_not_archived" (
          CHECK ( "isArchived" = false )
        ) INHERITS ("card_partitioned")
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "card_archived"`);
        await queryRunner.query(`DROP TABLE "card_not_archived"`);
        await queryRunner.query(`DROP TABLE "card_partitioned"`);
    }

}
