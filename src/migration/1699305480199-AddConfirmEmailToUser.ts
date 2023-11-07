import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfirmEmailToUser1699305480199 implements MigrationInterface {
    name = 'AddConfirmEmailToUser1699305480199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "confirmEmail" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "confirmEmail"`);
    }

}
