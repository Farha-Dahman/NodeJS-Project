import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkspaceUser1698933591376 implements MigrationInterface {
  name = 'CreateWorkspaceUser1698933591376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workspace_user" ("id" SERIAL NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "userId" integer, "workspaceId" integer, CONSTRAINT "PK_a09cff0ab849da007d391eb9284" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9"`,
    );
    await queryRunner.query(`DROP TABLE "workspace_user"`);
  }
}
