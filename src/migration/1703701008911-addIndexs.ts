import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexs1703701008911 implements MigrationInterface {
    name = 'AddIndexs1703701008911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-27T18:16:52.755Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-27T18:16:52.755Z"'`);
        await queryRunner.query(`CREATE INDEX "isAdmin_index" ON "board_user" ("isAdmin") `);
        await queryRunner.query(`CREATE INDEX "index_card_action" ON "card_activity" ("action") `);
        await queryRunner.query(`CREATE INDEX "index_uploaded_date" ON "card_attachment" ("uploadedDate") `);
        await queryRunner.query(`CREATE INDEX "index_created_date" ON "comment" ("createdDate") `);
        await queryRunner.query(`CREATE INDEX "isArchived_list_index" ON "list" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "index_title" ON "card" ("title") `);
        await queryRunner.query(`CREATE INDEX "isArchived_card_index" ON "card" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "index_isRead" ON "notification" ("isRead") `);
        await queryRunner.query(`CREATE INDEX "index_name" ON "workspace" ("name") `);
        await queryRunner.query(`CREATE INDEX "index_isAdmin" ON "workspace_user" ("isAdmin") `);
        await queryRunner.query(`CREATE INDEX "index_fullName" ON "user" ("fullName") `);
        await queryRunner.query(`CREATE INDEX "index_isConfirmed" ON "user" ("isConfirmed") `);
        await queryRunner.query(`CREATE INDEX "index_board_action" ON "board_activity" ("action") `);
        await queryRunner.query(`CREATE INDEX "isPublic_isClosed_index" ON "board" ("isPublic", "isClosed") `);
        await queryRunner.query(`CREATE INDEX "color_index" ON "board_label" ("color") `);
        await queryRunner.query(`CREATE INDEX "title_index" ON "board_label" ("title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."title_index"`);
        await queryRunner.query(`DROP INDEX "public"."color_index"`);
        await queryRunner.query(`DROP INDEX "public"."isPublic_isClosed_index"`);
        await queryRunner.query(`DROP INDEX "public"."index_board_action"`);
        await queryRunner.query(`DROP INDEX "public"."index_isConfirmed"`);
        await queryRunner.query(`DROP INDEX "public"."index_fullName"`);
        await queryRunner.query(`DROP INDEX "public"."index_isAdmin"`);
        await queryRunner.query(`DROP INDEX "public"."index_name"`);
        await queryRunner.query(`DROP INDEX "public"."index_isRead"`);
        await queryRunner.query(`DROP INDEX "public"."isArchived_card_index"`);
        await queryRunner.query(`DROP INDEX "public"."index_title"`);
        await queryRunner.query(`DROP INDEX "public"."isArchived_list_index"`);
        await queryRunner.query(`DROP INDEX "public"."index_created_date"`);
        await queryRunner.query(`DROP INDEX "public"."index_uploaded_date"`);
        await queryRunner.query(`DROP INDEX "public"."index_card_action"`);
        await queryRunner.query(`DROP INDEX "public"."isAdmin_index"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-21 09:32:33.012+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-21 09:32:33.012+02'`);
    }

}
