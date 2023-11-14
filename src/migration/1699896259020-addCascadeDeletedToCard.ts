import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeletedToCard1699896259020 implements MigrationInterface {
    name = 'AddCascadeDeletedToCard1699896259020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_label" DROP CONSTRAINT "FK_2400b258e4a4c55add6c9b73766"`);
        await queryRunner.query(`ALTER TABLE "card_label" ADD CONSTRAINT "FK_2400b258e4a4c55add6c9b73766" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_label" DROP CONSTRAINT "FK_2400b258e4a4c55add6c9b73766"`);
        await queryRunner.query(`ALTER TABLE "card_label" ADD CONSTRAINT "FK_2400b258e4a4c55add6c9b73766" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
