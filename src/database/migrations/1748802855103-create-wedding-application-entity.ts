import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWeddingApplicationEntity1748802855103 implements MigrationInterface {
    name = 'CreateWeddingApplicationEntity1748802855103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wedding_application" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "phone" character varying(10) NOT NULL, "email" character varying(100) NOT NULL, "song" character varying(500) NOT NULL, CONSTRAINT "PK_126ccead50aa2e05df60a892940" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "wedding_application"`);
    }

}
