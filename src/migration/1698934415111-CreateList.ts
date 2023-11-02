import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateList1698934415111 implements MigrationInterface {
  name = 'CreateList1698934415111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "position" integer NOT NULL, "boardId" integer, CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list" ADD CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list" DROP CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5"`,
    );
    await queryRunner.query(`DROP TABLE "list"`);
  }
}
