import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationCommentCard1700162670142 implements MigrationInterface {
  name = 'AddRelationCommentCard1700162670142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "comment" ADD "cardId" integer');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-16T19:24:36.317Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-16T19:24:36.317Z"\'');
    await queryRunner.query('ALTER TABLE "comment" ADD CONSTRAINT "FK_5dd31f454fdc52a2e336264b076" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "comment" DROP CONSTRAINT "FK_5dd31f454fdc52a2e336264b076"');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-16 16:00:31.469+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-16 16:00:31.469+02\'');
    await queryRunner.query('ALTER TABLE "comment" DROP COLUMN "cardId"');
  }

}
