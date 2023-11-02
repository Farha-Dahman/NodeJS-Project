import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCardUser1698935747170 implements MigrationInterface {
  name = 'CreateCardUser1698935747170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "card_user" (
        "userId" integer NOT NULL,
        "cardId" integer NOT NULL,
        CONSTRAINT "PK_1e1a78a5a3184d0ec97533be211" PRIMARY KEY ("userId", "cardId")
    );`);
    await queryRunner.query(
      `CREATE INDEX "IDX_25f0f5b818ecefdf04e15aabf8" ON "card_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_102c90387df685584145bfa120" ON "card_user" ("cardId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "card_user" ADD CONSTRAINT "FK_25f0f5b818ecefdf04e15aabf8a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_user" ADD CONSTRAINT "FK_102c90387df685584145bfa1206" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card_user" DROP CONSTRAINT "FK_102c90387df685584145bfa1206";`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_user" DROP CONSTRAINT "FK_25f0f5b818ecefdf04e15aabf8a";`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_102c90387df685584145bfa120"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_25f0f5b818ecefdf04e15aabf8"`,
    );
    await queryRunner.query('DROP TABLE "card_user";');
  }
}
