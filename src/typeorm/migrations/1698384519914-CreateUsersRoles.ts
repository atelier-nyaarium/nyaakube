import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersRoles1698384519914 implements MigrationInterface {
    name = 'CreateUsersRoles1698384519914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "totp_secret" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_role_assignments" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_df5ad2627548ecf9bbe06ae623e" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_93cea1ca456dfe534718d87614" ON "user_role_assignments" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dea95d81638096d74394fd3339" ON "user_role_assignments" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "user_role_assignments" ADD CONSTRAINT "FK_93cea1ca456dfe534718d876149" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role_assignments" ADD CONSTRAINT "FK_dea95d81638096d74394fd33391" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role_assignments" DROP CONSTRAINT "FK_dea95d81638096d74394fd33391"`);
        await queryRunner.query(`ALTER TABLE "user_role_assignments" DROP CONSTRAINT "FK_93cea1ca456dfe534718d876149"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dea95d81638096d74394fd3339"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93cea1ca456dfe534718d87614"`);
        await queryRunner.query(`DROP TABLE "user_role_assignments"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
