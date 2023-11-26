import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardUser1698934300903 implements MigrationInterface {
  name = 'CreateBoardUser1698934300903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "board_user" ("id" SERIAL NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "userId" integer, "boardId" integer, CONSTRAINT "PK_b157cf902abe253a55961e8920b" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "board_user" ADD CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"',
    );
    await queryRunner.query(
      'ALTER TABLE "board_user" DROP CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc"',
    );
    await queryRunner.query('DROP TABLE "board_user"');
  }
}
