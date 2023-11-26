import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsClosedToBoard1699798192448 implements MigrationInterface {
  name = 'AddIsClosedToBoard1699798192448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "board" ADD "isClosed" boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-12T14:09:57.852Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-12T14:09:57.852Z"\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-12 15:45:40.65+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-12 15:45:40.65+02\'');
    await queryRunner.query('ALTER TABLE "board" DROP COLUMN "isClosed"');
  }

}
