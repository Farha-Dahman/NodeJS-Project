import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAttachmentLocationType1700403607182 implements MigrationInterface {
  name = 'UpdateAttachmentLocationType1700403607182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "card_attachment" DROP COLUMN "location"');
    await queryRunner.query('ALTER TABLE "card_attachment" ADD "location" json');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'"2023-11-19T14:20:17.268Z"\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'"2023-11-19T14:20:17.268Z"\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT \'2023-11-16 21:24:36.317+02\'');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT \'2023-11-16 21:24:36.317+02\'');
    await queryRunner.query('ALTER TABLE "card_attachment" DROP COLUMN "location"');
    await queryRunner.query('ALTER TABLE "card_attachment" ADD "location" character varying NOT NULL');
  }

}
