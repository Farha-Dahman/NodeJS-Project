import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePrimaryKeyInBoardUser1699789445949 implements MigrationInterface {
    name = 'UpdatePrimaryKeyInBoardUser1699789445949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "PK_b157cf902abe253a55961e8920b"`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "PK_b86a8a102aec17209d351e53e29" PRIMARY KEY ("userId", "boardId")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-11-12T11:44:10.491Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-11-12T11:44:10.491Z"'`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc"`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"`);
        await queryRunner.query(`ALTER TABLE "board_user" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board_user" ALTER COLUMN "boardId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "board_user" ALTER COLUMN "boardId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board_user" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-11-09 16:12:10.638+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-11-09 16:12:10.638+02'`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "PK_b86a8a102aec17209d351e53e29"`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "PK_b157cf902abe253a55961e8920b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
