import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUpdate1746550099422 implements MigrationInterface {
    name = 'UserUpdate1746550099422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastname" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userGroupId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userGroupId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastname" SET NOT NULL`);
    }

}
