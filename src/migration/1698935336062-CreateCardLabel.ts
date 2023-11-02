import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCardLabel1698935336062 implements MigrationInterface {
  name = 'CreateCardLabel1698935336062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` CREATE TABLE "card_label" ("cardId" integer NOT NULL, "boardLabelId" integer NOT NULL, CONSTRAINT "PK_cf0303b0107b581dbbb84ee90d2" PRIMARY KEY ("cardId", "boardLabelId") );`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2400b258e4a4c55add6c9b7376" ON "card_label" ("cardId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_80b458dbce8886c85700ebffe3" ON "card_label" ("boardLabelId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "card_label" ADD CONSTRAINT "FK_2400b258e4a4c55add6c9b73766" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      ` ALTER TABLE "card_label" ADD CONSTRAINT "FK_80b458dbce8886c85700ebffe3b" FOREIGN KEY ("boardLabelId") REFERENCES "board_label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card_label" DROP CONSTRAINT "FK_80b458dbce8886c85700ebffe3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_label" DROP CONSTRAINT "FK_2400b258e4a4c55add6c9b73766"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_80b458dbce8886c85700ebffe3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2400b258e4a4c55add6c9b7376"`,
    );
    await queryRunner.query(`DROP TABLE "card_label"`);
  }
}
