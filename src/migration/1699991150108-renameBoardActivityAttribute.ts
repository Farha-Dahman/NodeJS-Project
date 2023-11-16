import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameBoardActivityAttribute1699991150108 implements MigrationInterface {
    name = 'RenameBoardActivityAttribute1699991150108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "board_activity" RENAME COLUMN "description" TO "action"`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-11-14T19:45:57.072Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-11-14T19:45:57.072Z"'`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-11-13 10:50:31.135+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-11-13 10:50:31.135+02'`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board_activity" RENAME COLUMN "action" TO "description"`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
