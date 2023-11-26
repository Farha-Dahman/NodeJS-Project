import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkspace1698933450770 implements MigrationInterface {
  name = 'CreateWorkspace1698933450770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "type" character varying(50) NOT NULL, "description" text, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "workspace"');
  }
}
