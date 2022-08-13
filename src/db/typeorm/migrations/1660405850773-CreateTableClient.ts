import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableClient1660405850773 implements MigrationInterface {
  name = 'CreateTableClient1660405850773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client" ("id" uuid NOT NULL, "name" character(255) NOT NULL, "account" character(255) NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
