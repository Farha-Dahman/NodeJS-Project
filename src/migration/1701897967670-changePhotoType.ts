import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePhotoType1701897967670 implements MigrationInterface {
    name = 'ChangePhotoType1701897967670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photo" json`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-06T21:26:11.630Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-06T21:26:11.630Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-11-23 15:29:10.298+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-11-23 15:29:10.298+02'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photo" character varying(15000)`);
    }

}
