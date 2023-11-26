import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRealtionBetweenBoardWorkspace1699796735349 implements MigrationInterface {
  name = 'AddRealtionBetweenBoardWorkspace1699796735349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "board" ADD "workspaceId" integer');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-12T13:45:40.650Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-12T13:45:40.650Z"\'');
    await queryRunner.query('ALTER TABLE "board" ADD CONSTRAINT "FK_394199497c0242b3270d03611bf" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "board" DROP CONSTRAINT "FK_394199497c0242b3270d03611bf"');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-12 13:44:10.491+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-12 13:44:10.491+02\'');
    await queryRunner.query('ALTER TABLE "board" DROP COLUMN "workspaceId"');
  }

}
