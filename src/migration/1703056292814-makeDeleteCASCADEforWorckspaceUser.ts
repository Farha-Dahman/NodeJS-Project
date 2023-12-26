import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDeleteCASCADEforWorckspaceUser1703056292814 implements MigrationInterface {
    name = 'MakeDeleteCASCADEforWorckspaceUser1703056292814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-12-20T07:11:38.531Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-12-20T07:11:38.532Z"'`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2023-12-06 23:26:11.63+02'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2023-12-06 23:26:11.63+02'`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
