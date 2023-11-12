import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePrimaryKeyInWorkspaceUser1699539122941 implements MigrationInterface {
    name = 'UpdatePrimaryKeyInWorkspaceUser1699539122941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "PK_a09cff0ab849da007d391eb9284"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "PK_1453ea3cf1edc0a96464149dd46" PRIMARY KEY ("userId", "workspaceId")`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ALTER COLUMN "workspaceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2023-11-09T14:12:10.638Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-11-09T14:12:10.638Z"'`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ALTER COLUMN "workspaceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "PK_1453ea3cf1edc0a96464149dd46"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "PK_a09cff0ab849da007d391eb9284" PRIMARY KEY ("id")`);
    }

}
