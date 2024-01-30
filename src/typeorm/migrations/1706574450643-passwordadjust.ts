import { MigrationInterface, QueryRunner } from "typeorm";

export class Passwordadjust1706574450643 implements MigrationInterface {
    name = 'Passwordadjust1706574450643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_salt" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_salt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text NOT NULL`);
    }

}
