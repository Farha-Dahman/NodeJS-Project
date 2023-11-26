import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUpdateAtCreateAtDefaults1699352235384 implements MigrationInterface {
  name = 'UpdateUpdateAtCreateAtDefaults1699352235384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-07T10:17:19.014Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-07T10:17:19.014Z"\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now()');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now()');
  }

}
