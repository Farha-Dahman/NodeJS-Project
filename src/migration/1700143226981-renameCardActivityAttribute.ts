import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCardActivityAttribute1700143226981 implements MigrationInterface {
    name = 'RenameCardActivityAttribute1700143226981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_activity" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD "action" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD "timestamp" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-11-16T14:00:31.469Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-11-16T14:00:31.469Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-11-15 09:16:55.448+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-11-15 09:16:55.448+02'`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
