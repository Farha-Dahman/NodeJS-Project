import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSendCodeToUser1700687429135 implements MigrationInterface {
  name = 'AddSendCodeToUser1700687429135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ADD "sendCode" character varying');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-22T21:10:32.549Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-22T21:10:32.549Z"\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-19 16:20:17.268+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-19 16:20:17.268+02\'');
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "sendCode"');
  }

}
