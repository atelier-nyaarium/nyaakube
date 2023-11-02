import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSession1698886754882 implements MigrationInterface {
    name = 'CreateSession1698886754882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("sid" character varying(255) NOT NULL, "sess" json NOT NULL, "expire" TIMESTAMP(6) NOT NULL, CONSTRAINT "PK_7575923e18b495ed2307ae629ae" PRIMARY KEY ("sid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_72ee4135086941ddca6a9b4b20" ON "session" ("expire") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_72ee4135086941ddca6a9b4b20"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
