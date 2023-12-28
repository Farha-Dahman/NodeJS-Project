import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPartialIndexs1703764794224 implements MigrationInterface {
    name = 'AddPartialIndexs1703764794224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE INDEX "isAdmin_index" ON "board_user" ("isAdmin") WHERE "isAdmin" = true');
        await queryRunner.query('CREATE INDEX "isArchived_card_index" ON "card" ("isArchived") WHERE "isArchived" = true');
        await queryRunner.query('CREATE INDEX "isArchived_list_index" ON "list" ("isArchived") WHERE "isArchived" = true');
        await queryRunner.query('CREATE INDEX "index_isConfirmed" ON "user" ("isConfirmed") WHERE "isConfirmed" = true');
        await queryRunner.query('CREATE INDEX "index_isAdmin" ON "workspace_user" ("isAdmin") WHERE "isAdmin" = true');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "isAdmin_index"');
        await queryRunner.query('DROP INDEX "isArchived_card_index"');
        await queryRunner.query('DROP INDEX "isArchived_list_index"');
        await queryRunner.query('DROP INDEX "index_isConfirmed"');
        await queryRunner.query('DROP INDEX "index_isAdmin"');
    }

}
