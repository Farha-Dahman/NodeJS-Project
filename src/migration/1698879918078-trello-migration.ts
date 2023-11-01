import { MigrationInterface, QueryRunner } from "typeorm";

export class TrelloMigration1698879918078 implements MigrationInterface {
    name = 'TrelloMigration1698879918078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "action" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer, "receiverId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card_activity" ("id" SERIAL NOT NULL, "description" text NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "cardId" integer, CONSTRAINT "PK_aa479447459fe678ebc58fabd01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "list" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "position" integer NOT NULL, "boardId" integer, CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card_attachment" ("id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "uploadedDate" TIMESTAMP NOT NULL DEFAULT now(), "location" character varying NOT NULL, "cardId" integer, CONSTRAINT "PK_f46c6bd4c846915183bb0ca2e68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board_label" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "color" character varying(10) NOT NULL, "boardId" integer, CONSTRAINT "PK_94cc37e81312bee4d1a1ca7d022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" text NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "dueDate" TIMESTAMP, "reminderDate" TIMESTAMP, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "listId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "type" character varying(50) NOT NULL, "description" text, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workspace_user" ("id" SERIAL NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "userId" integer, "workspaceId" integer, CONSTRAINT "PK_a09cff0ab849da007d391eb9284" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board_activity" ("id" SERIAL NOT NULL, "description" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "boardId" integer, CONSTRAINT "PK_6893c0c7fd953c00b6564ff601b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(1000) NOT NULL, "fullName" character varying(255) NOT NULL, "photo" character varying(15000), "phone" character varying(100), "jobTitle" character varying(100) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "board_user" ("id" SERIAL NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "userId" integer, "boardId" integer, CONSTRAINT "PK_b157cf902abe253a55961e8920b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card_label" ("cardId" integer NOT NULL, "boardLabelId" integer NOT NULL, CONSTRAINT "PK_cf0303b0107b581dbbb84ee90d2" PRIMARY KEY ("cardId", "boardLabelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2400b258e4a4c55add6c9b7376" ON "card_label" ("cardId") `);
        await queryRunner.query(`CREATE INDEX "IDX_80b458dbce8886c85700ebffe3" ON "card_label" ("boardLabelId") `);
        await queryRunner.query(`CREATE TABLE "card_user" ("userId" integer NOT NULL, "cardId" integer NOT NULL, CONSTRAINT "PK_1e1a78a5a3184d0ec97533be211" PRIMARY KEY ("userId", "cardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25f0f5b818ecefdf04e15aabf8" ON "card_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_102c90387df685584145bfa120" ON "card_user" ("cardId") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_758d70a0e61243171e785989070" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_activity" ADD CONSTRAINT "FK_8ea687165b973139aff7f047451" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_attachment" ADD CONSTRAINT "FK_d60d1c9c61c855d01332300edae" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_label" ADD CONSTRAINT "FK_fe426ab06a468e04e170c6f9547" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_user" ADD CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_activity" ADD CONSTRAINT "FK_211fbeb7a706501144e6d46aa24" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_activity" ADD CONSTRAINT "FK_02c0b98c26489410eee99f1c9bc" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_user" ADD CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_label" ADD CONSTRAINT "FK_2400b258e4a4c55add6c9b73766" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_label" ADD CONSTRAINT "FK_80b458dbce8886c85700ebffe3b" FOREIGN KEY ("boardLabelId") REFERENCES "board_label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_user" ADD CONSTRAINT "FK_25f0f5b818ecefdf04e15aabf8a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "card_user" ADD CONSTRAINT "FK_102c90387df685584145bfa1206" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_user" DROP CONSTRAINT "FK_102c90387df685584145bfa1206"`);
        await queryRunner.query(`ALTER TABLE "card_user" DROP CONSTRAINT "FK_25f0f5b818ecefdf04e15aabf8a"`);
        await queryRunner.query(`ALTER TABLE "card_label" DROP CONSTRAINT "FK_80b458dbce8886c85700ebffe3b"`);
        await queryRunner.query(`ALTER TABLE "card_label" DROP CONSTRAINT "FK_2400b258e4a4c55add6c9b73766"`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6"`);
        await queryRunner.query(`ALTER TABLE "board_user" DROP CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc"`);
        await queryRunner.query(`ALTER TABLE "board_activity" DROP CONSTRAINT "FK_02c0b98c26489410eee99f1c9bc"`);
        await queryRunner.query(`ALTER TABLE "board_activity" DROP CONSTRAINT "FK_211fbeb7a706501144e6d46aa24"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_c0c0d4527c85db43fce8740df63"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" DROP CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0"`);
        await queryRunner.query(`ALTER TABLE "board_label" DROP CONSTRAINT "FK_fe426ab06a468e04e170c6f9547"`);
        await queryRunner.query(`ALTER TABLE "card_attachment" DROP CONSTRAINT "FK_d60d1c9c61c855d01332300edae"`);
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_8ea687165b973139aff7f047451"`);
        await queryRunner.query(`ALTER TABLE "card_activity" DROP CONSTRAINT "FK_f316c56727541ed08ae9dd3c95a"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_758d70a0e61243171e785989070"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_102c90387df685584145bfa120"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25f0f5b818ecefdf04e15aabf8"`);
        await queryRunner.query(`DROP TABLE "card_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80b458dbce8886c85700ebffe3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2400b258e4a4c55add6c9b7376"`);
        await queryRunner.query(`DROP TABLE "card_label"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "board_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "board_activity"`);
        await queryRunner.query(`DROP TABLE "workspace_user"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "board_label"`);
        await queryRunner.query(`DROP TABLE "card_attachment"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "card_activity"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
