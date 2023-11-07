import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConfirmEmailColumn1699345874117 implements MigrationInterface {
    name = 'UpdateConfirmEmailColumn1699345874117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "confirmEmail" TO "isConfirmed"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isConfirmed" TO "confirmEmail"`);
    }

}
