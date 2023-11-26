import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSendCodeNameInUser1700746145227 implements MigrationInterface {
  name = 'UpdateSendCodeNameInUser1700746145227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" RENAME COLUMN "sendCode" TO "codeSent"');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-23T13:29:10.298Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-23T13:29:10.298Z"\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-22 23:10:32.549+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-22 23:10:32.549+02\'');
    await queryRunner.query('ALTER TABLE "user" RENAME COLUMN "codeSent" TO "sendCode"');
  }

}
