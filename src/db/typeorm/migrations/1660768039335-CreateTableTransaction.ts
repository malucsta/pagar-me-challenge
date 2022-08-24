import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransaction1660768039335 implements MigrationInterface {
  name = 'CreateTableTransaction1660768039335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL, "description" character(512) NOT NULL, "payment_method" integer NOT NULL, "value" double precision NOT NULL, "card_number" character(4) NOT NULL, "card_owner" character(255) NOT NULL, "card_expiration_date" character(7) NOT NULL, "card_cvv" character(3) NOT NULL, "fk_client_id" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_58c4feba61cbc19d8f27e2fba87" FOREIGN KEY ("fk_client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_58c4feba61cbc19d8f27e2fba87"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
