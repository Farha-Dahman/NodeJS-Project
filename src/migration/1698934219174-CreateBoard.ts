import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoard1698934219174 implements MigrationInterface {
  name = 'CreateBoard1698934219174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "board" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "board"');
  }
}
