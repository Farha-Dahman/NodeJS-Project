import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeWorkspaceCascadeDeleted1699598206485 implements MigrationInterface {
  name = 'MakeWorkspaceCascadeDeleted1699598206485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);

  }
}
