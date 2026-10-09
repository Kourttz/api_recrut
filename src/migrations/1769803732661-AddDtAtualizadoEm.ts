import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDtAtualizadoEm1769800494917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "gestao"`);

        await queryRunner.query(`
            ALTER TABLE "tb_candidatos" 
            ADD COLUMN IF NOT EXISTS "dt_atualizado_em" TIMESTAMP DEFAULT now()
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tb_historico_candidatura" (
                "co_historico_candidatura" SERIAL PRIMARY KEY,
                "co_usuario" integer,
                "co_candidatura" integer,
                "no_historico" varchar(255),
                "dt_registro" TIMESTAMP DEFAULT now(),
                
                -- Configuração das Foreign Keys
                CONSTRAINT "FK_historico_usuario" FOREIGN KEY ("co_usuario") 
                    REFERENCES "gestao"."tb_usuarios"("co_usuario") ON DELETE CASCADE,
                
                CONSTRAINT "FK_historico_candidatura" FOREIGN KEY ("co_candidatura") 
                    REFERENCES "tb_candidaturas"("co_candidatura") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "tb_historico_candidatura"`);
        await queryRunner.query(`ALTER TABLE "tb_candidatos" DROP COLUMN IF EXISTS "dt_atualizado_em"`);
    }
}