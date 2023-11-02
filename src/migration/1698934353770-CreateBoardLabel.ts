import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardLabel1698934353770 implements MigrationInterface {
  name = 'CreateBoardLabel1698934353770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "board_label" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "color" character varying(10) NOT NULL, "boardId" integer, CONSTRAINT "PK_94cc37e81312bee4d1a1ca7d022" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_label" ADD CONSTRAINT "FK_fe426ab06a468e04e170c6f9547" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "board_label" DROP CONSTRAINT "FK_fe426ab06a468e04e170c6f9547"`,
    );
    await queryRunner.query(`DROP TABLE "board_label"`);
  }
}
