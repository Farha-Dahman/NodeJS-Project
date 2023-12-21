import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDeleteCascadeForCard1703143947935 implements MigrationInterface {
    name = 'MakeDeleteCascadeForCard1703143947935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_5dd31f454fdc52a2e336264b076"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a"`);
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-21T07:32:33.012Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-21T07:32:33.012Z"'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_5dd31f454fdc52a2e336264b076" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_5dd31f454fdc52a2e336264b076"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-20 21:02:35.857+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-20 21:02:35.857+02'`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_5dd31f454fdc52a2e336264b076" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
