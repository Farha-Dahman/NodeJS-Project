import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1698933279883 implements MigrationInterface {
  name = 'CreateUser1698933279883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(1000) NOT NULL, "fullName" character varying(255) NOT NULL, "photo" character varying(15000), "phone" character varying(100), "jobTitle" character varying(100) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"',
    );
    await queryRunner.query('DROP TABLE "user"');
  }
}
