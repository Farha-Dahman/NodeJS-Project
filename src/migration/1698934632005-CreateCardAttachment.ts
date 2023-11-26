import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCardAttachment1698934632005 implements MigrationInterface {
  name = 'CreateCardAttachment1698934632005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "card_attachment" ("id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "uploadedDate" TIMESTAMP NOT NULL DEFAULT now(), "location" character varying NOT NULL, "cardId" integer, CONSTRAINT "PK_f46c6bd4c846915183bb0ca2e68" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"',
    );
    await queryRunner.query('DROP TABLE "card_attachment"');
  }
}
