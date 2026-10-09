import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusEducacaoAndUsuarioAtribuidoCandidaturas1700000000000
  implements MigrationInterface
{
  name =
    'AddStatusEducacaoAndUsuarioAtribuidoCandidaturas1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==========================================
    // tb_educacao → adicionar no_status
    // ==========================================
    await queryRunner.query(`
      ALTER TABLE tb_educacao
      ADD COLUMN no_status varchar(100)
    `);

    // ==========================================
    // tb_candidaturas → adicionar co_usuario_atribuido
    // ==========================================
    await queryRunner.query(`
      ALTER TABLE tb_candidaturas
      ADD COLUMN co_usuario_atribuido int
    `);

    // ==========================================
    // FK → tb_candidaturas.co_usuario_atribuido
    // ==========================================
    await queryRunner.query(`
      ALTER TABLE tb_candidaturas
      ADD CONSTRAINT fk_candidaturas_usuario_atribuido
      FOREIGN KEY (co_usuario_atribuido)
      REFERENCES gestao.tb_usuarios(co_usuario)
      ON DELETE SET NULL
    `);


    await queryRunner.query(`
      CREATE INDEX idx_candidaturas_usuario_atribuido
      ON tb_candidaturas(co_usuario_atribuido)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_candidaturas_usuario_atribuido
    `);

    // Remover FK
    await queryRunner.query(`
      ALTER TABLE tb_candidaturas
      DROP CONSTRAINT IF EXISTS fk_candidaturas_usuario_atribuido
    `);

    // Remover coluna
    await queryRunner.query(`
      ALTER TABLE tb_candidaturas
      DROP COLUMN IF EXISTS co_usuario_atribuido
    `);

    // Remover coluna tb_educacao
    await queryRunner.query(`
      ALTER TABLE tb_educacao
      DROP COLUMN IF EXISTS no_status
    `);
  }
}
