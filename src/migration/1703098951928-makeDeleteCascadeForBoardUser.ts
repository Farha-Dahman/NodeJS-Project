import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDeleteCascadeForBoardUser1703098951928 implements MigrationInterface {
    name = 'MakeDeleteCascadeForBoardUser1703098951928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-20T19:02:35.857Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-20T19:02:35.857Z"'`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-20 20:37:36.294+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-20 20:37:36.294+02'`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
