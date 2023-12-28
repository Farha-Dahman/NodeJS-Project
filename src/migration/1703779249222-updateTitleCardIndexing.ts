import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTitleCardIndexing1703779249222 implements MigrationInterface {
    name = 'UpdateTitleCardIndexing1703779249222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."isAdmin_index"`);
        await queryRunner.query(`DROP INDEX "public"."index_isAdmin"`);
        await queryRunner.query(`DROP INDEX "public"."index_isConfirmed"`);
        await queryRunner.query(`DROP INDEX "public"."isArchived_list_index"`);
        await queryRunner.query(`DROP INDEX "public"."index_title"`);
        await queryRunner.query(`DROP INDEX "public"."isArchived_card_index"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-28T16:00:56.382Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-28T16:00:56.382Z"'`);
        await queryRunner.query(`CREATE INDEX "card_title_idx" ON "card" ("title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."card_title_idx"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-28 17:23:56.177+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-28 17:23:56.177+02'`);
        await queryRunner.query(`CREATE INDEX "isArchived_card_index" ON "card" ("isArchived") WHERE ("isArchived" = true)`);
        await queryRunner.query(`CREATE INDEX "index_title" ON "card" ("title") `);
        await queryRunner.query(`CREATE INDEX "isArchived_list_index" ON "list" ("isArchived") WHERE ("isArchived" = true)`);
        await queryRunner.query(`CREATE INDEX "index_isConfirmed" ON "user" ("isConfirmed") WHERE ("isConfirmed" = true)`);
        await queryRunner.query(`CREATE INDEX "index_isAdmin" ON "workspace_user" ("isAdmin") WHERE ("isAdmin" = true)`);
        await queryRunner.query(`CREATE INDEX "isAdmin_index" ON "board_user" ("isAdmin") WHERE ("isAdmin" = true)`);
    }

}
