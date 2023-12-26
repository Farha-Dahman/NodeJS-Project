import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDeleteCASCADEforBoardUser1703097449003 implements MigrationInterface {
    name = 'MakeDeleteCASCADEforBoardUser1703097449003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-20T18:37:36.294Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-20T18:37:36.294Z"'`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-20 09:11:38.532+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-20 09:11:38.531+02'`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
