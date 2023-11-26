import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsArchivedToList1699865426138 implements MigrationInterface {
  name = 'AddIsArchivedToList1699865426138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "list" DROP CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5"');
    await queryRunner.query('ALTER TABLE "board_label" DROP CONSTRAINT "FK_fe426ab06a468e04e170c6f9547"');
    await queryRunner.query('ALTER TABLE "board_activity" DROP CONSTRAINT "FK_211fbeb7a706501144e6d46aa24"');
    await queryRunner.query('ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"');
    await queryRunner.query('ALTER TABLE "list" ADD "isArchived" boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-13T08:50:31.135Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-13T08:50:31.135Z"\'');
    await queryRunner.query('ALTER TABLE "list" ADD CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "board_label" ADD CONSTRAINT "FK_fe426ab06a468e04e170c6f9547" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "board_activity" ADD CONSTRAINT "FK_211fbeb7a706501144e6d46aa24" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"');
    await queryRunner.query('ALTER TABLE "board_activity" DROP CONSTRAINT "FK_211fbeb7a706501144e6d46aa24"');
    await queryRunner.query('ALTER TABLE "board_label" DROP CONSTRAINT "FK_fe426ab06a468e04e170c6f9547"');
    await queryRunner.query('ALTER TABLE "list" DROP CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5"');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-12 16:09:57.852+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-12 16:09:57.852+02\'');
    await queryRunner.query('ALTER TABLE "list" DROP COLUMN "isArchived"');
    await queryRunner.query('ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE "board_activity" ADD CONSTRAINT "FK_211fbeb7a706501144e6d46aa24" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE "board_label" ADD CONSTRAINT "FK_fe426ab06a468e04e170c6f9547" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE "list" ADD CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE');
  }

}
