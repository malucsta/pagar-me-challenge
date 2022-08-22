import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePayable1660916079892 implements MigrationInterface {
  name = 'CreateTablePayable1660916079892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payable" ("id" uuid NOT NULL, "value" double precision NOT NULL, "paymentDate" date NOT NULL, "status" integer NOT NULL, "fk_client_id" uuid NOT NULL, "fk_transaction_id" uuid NOT NULL, CONSTRAINT "REL_87678ea0cca9cbf4bd11e069bf" UNIQUE ("fk_transaction_id"), CONSTRAINT "PK_9c451177bd6644fd97344ea3761" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payable" ADD CONSTRAINT "FK_8551ab2b6bc4517b271311b30e0" FOREIGN KEY ("fk_client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payable" ADD CONSTRAINT "FK_87678ea0cca9cbf4bd11e069bf9" FOREIGN KEY ("fk_transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payable" DROP CONSTRAINT "FK_87678ea0cca9cbf4bd11e069bf9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payable" DROP CONSTRAINT "FK_8551ab2b6bc4517b271311b30e0"`,
    );
    await queryRunner.query(`DROP TABLE "payable"`);
  }
}
