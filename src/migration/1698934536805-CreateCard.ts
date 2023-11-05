import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCard1698934536805 implements MigrationInterface {
  name = 'CreateCard1698934536805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" text NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "dueDate" TIMESTAMP, "reminderDate" TIMESTAMP, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "listId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card" DROP CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0"`,
    );
    await queryRunner.query(`DROP TABLE "card"`);
  }
}
