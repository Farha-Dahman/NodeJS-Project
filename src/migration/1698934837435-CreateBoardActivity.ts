import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardActivity1698934837435 implements MigrationInterface {
  name = 'CreateBoardActivity1698934837435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "board_activity" ("id" SERIAL NOT NULL, "description" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "boardId" integer, CONSTRAINT "PK_6893c0c7fd953c00b6564ff601b" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "board_activity" ADD CONSTRAINT "FK_211fbeb7a706501144e6d46aa24" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "board_activity" ADD CONSTRAINT "FK_02c0b98c26489410eee99f1c9bc" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "board_activity" DROP CONSTRAINT "FK_02c0b98c26489410eee99f1c9bc"',
    );
    await queryRunner.query(
      'ALTER TABLE "board_activity" DROP CONSTRAINT "FK_211fbeb7a706501144e6d46aa24"',
    );
    await queryRunner.query('DROP TABLE "board_activity"');
  }
}
