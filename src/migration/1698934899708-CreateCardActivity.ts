import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCardActivity1698934899708 implements MigrationInterface {
  name = 'CreateCardActivity1698934899708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "card_activity" ("id" SERIAL NOT NULL, "description" text NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "cardId" integer, CONSTRAINT "PK_aa479447459fe678ebc58fabd01" PRIMARY KEY ("id"))',
    );

    await queryRunner.query(
      'ALTER TABLE "card_activity" ADD CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"',
    );
    await queryRunner.query(
      'ALTER TABLE "card_activity" DROP CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a"',
    );
    await queryRunner.query('DROP TABLE "card_activity"');
  }
}
