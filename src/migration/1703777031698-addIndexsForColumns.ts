import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexsForColumns1703777031698 implements MigrationInterface {
    name = 'AddIndexsForColumns1703777031698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."index_card_action"`);
        await queryRunner.query(`DROP INDEX "public"."index_uploaded_date"`);
        await queryRunner.query(`DROP INDEX "public"."index_created_date"`);
        await queryRunner.query(`DROP INDEX "public"."index_name"`);
        await queryRunner.query(`DROP INDEX "public"."index_fullName"`);
        await queryRunner.query(`DROP INDEX "public"."index_board_action"`);
        await queryRunner.query(`DROP INDEX "public"."isPublic_isClosed_index"`);
        await queryRunner.query(`DROP INDEX "public"."color_index"`);
        await queryRunner.query(`DROP INDEX "public"."title_index"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-28T15:23:56.177Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-28T15:23:56.177Z"'`);
        await queryRunner.query(`CREATE INDEX "board_user_isAdmin_idx" ON "board_user" ("isAdmin") WHERE "isAdmin" = true`);
        await queryRunner.query(`CREATE INDEX "card_activity_action_idx" ON "card_activity" ("action") `);
        await queryRunner.query(`CREATE INDEX "card_attachment_uploadedDate_idx" ON "card_attachment" ("uploadedDate") `);
        await queryRunner.query(`CREATE INDEX "comment_createdDate_idx" ON "comment" ("createdDate") `);
        await queryRunner.query(`CREATE INDEX "list_isArchived_idx" ON "list" ("isArchived") WHERE "isArchived" = true`);
        await queryRunner.query(`CREATE INDEX "card_isArchived_idx" ON "card" ("isArchived") WHERE "isArchived" = true`);
        await queryRunner.query(`CREATE INDEX "notification_isRead_idx" ON "notification" ("isRead") WHERE "isRead" = true`);
        await queryRunner.query(`CREATE INDEX "workspace_name_idx" ON "workspace" ("name") `);
        await queryRunner.query(`CREATE INDEX "workspace_user_isAdmin_idx" ON "workspace_user" ("isAdmin") WHERE "isAdmin" = true`);
        await queryRunner.query(`CREATE INDEX "user_fullName_idx" ON "user" ("fullName") `);
        await queryRunner.query(`CREATE INDEX "user_isConfirmed_idx" ON "user" ("isConfirmed") WHERE "isConfirmed" = true`);
        await queryRunner.query(`CREATE INDEX "board_activity_action_idx" ON "board_activity" ("action") `);
        await queryRunner.query(`CREATE INDEX "board_isPublic_isClosed_idx" ON "board" ("isPublic", "isClosed") `);
        await queryRunner.query(`CREATE INDEX "board_label_color_idx" ON "board_label" ("color") `);
        await queryRunner.query(`CREATE INDEX "board_label_title_idx" ON "board_label" ("title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."board_label_title_idx"`);
        await queryRunner.query(`DROP INDEX "public"."board_label_color_idx"`);
        await queryRunner.query(`DROP INDEX "public"."board_isPublic_isClosed_idx"`);
        await queryRunner.query(`DROP INDEX "public"."board_activity_action_idx"`);
        await queryRunner.query(`DROP INDEX "public"."user_isConfirmed_idx"`);
        await queryRunner.query(`DROP INDEX "public"."user_fullName_idx"`);
        await queryRunner.query(`DROP INDEX "public"."workspace_user_isAdmin_idx"`);
        await queryRunner.query(`DROP INDEX "public"."workspace_name_idx"`);
        await queryRunner.query(`DROP INDEX "public"."notification_isRead_idx"`);
        await queryRunner.query(`DROP INDEX "public"."card_isArchived_idx"`);
        await queryRunner.query(`DROP INDEX "public"."list_isArchived_idx"`);
        await queryRunner.query(`DROP INDEX "public"."comment_createdDate_idx"`);
        await queryRunner.query(`DROP INDEX "public"."card_attachment_uploadedDate_idx"`);
        await queryRunner.query(`DROP INDEX "public"."card_activity_action_idx"`);
        await queryRunner.query(`DROP INDEX "public"."board_user_isAdmin_idx"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-28 14:00:01.772+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-28 14:00:01.772+02'`);
        await queryRunner.query(`CREATE INDEX "title_index" ON "board_label" ("title") `);
        await queryRunner.query(`CREATE INDEX "color_index" ON "board_label" ("color") `);
        await queryRunner.query(`CREATE INDEX "isPublic_isClosed_index" ON "board" ("isPublic", "isClosed") `);
        await queryRunner.query(`CREATE INDEX "index_board_action" ON "board_activity" ("action") `);
        await queryRunner.query(`CREATE INDEX "index_fullName" ON "user" ("fullName") `);
        await queryRunner.query(`CREATE INDEX "index_name" ON "workspace" ("name") `);
        await queryRunner.query(`CREATE INDEX "index_createdDate" ON "comment" ("createdDate") `);
        await queryRunner.query(`CREATE INDEX "index_uploadedDate" ON "card_attachment" ("uploadedDate") `);
        await queryRunner.query(`CREATE INDEX "index_card_action" ON "card_activity" ("action") `);
    }

}
