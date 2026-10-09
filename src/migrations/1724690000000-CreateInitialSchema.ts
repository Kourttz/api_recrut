import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInitialSchema1724690000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar o schema 'gestao'
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS gestao`);

    // 2. Tabela: tb_usuarios (Movida para o novo schema 'gestao', se não existir)
    await queryRunner.createTable(new Table({
      name: "gestao.tb_usuarios",
      columns: [
        { name: "co_usuario", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_name", type: "varchar", isNullable: true },
        { name: "co_matricula", type: "varchar", isNullable: true },
        { name: "no_email", type: "varchar", isNullable: true },
        { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
        { name: "co_perfil", type: "int", isNullable: true },
        { name: "nu_filial", type: "int", isNullable: true },
        { name: "co_cpf", type: "varchar", isNullable: true },
      ],
    }), true);

    // 3. Tabela: tb_unidades
    await queryRunner.createTable(new Table({
      name: "gestao.tb_unidades",
      columns: [
        { name: "co_unidade", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "nu_filial", type: "int" },
        { name: "no_projeto", type: "varchar", isNullable: true },
        { name: "nu_contrato", type: "varchar", isNullable: true },
        { name: "dt_inicio", type: "date", isNullable: true },
        { name: "dt_fim", type: "date", isNullable: true },
        { name: "nu_cnpj", type: "varchar", isNullable: true },
        { name: "no_razao_social", type: "varchar", isNullable: true },
        { name: "no_endereco", type: "varchar", isNullable: true },
        { name: "no_municipio", type: "varchar", isNullable: true },
        { name: "no_unidade_federativa", type: "varchar", isNullable: true },
        { name: "co_usuario_gerente", type: "int", isNullable: true },
        { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
      ],
    }), true);

    // 4. Tabela: tb_funcoes
    await queryRunner.createTable(new Table({
      name: "tb_funcoes",
      columns: [
        { name: "co_funcao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_funcao", type: "varchar", isNullable: true },
        { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
      ],
    }), true);

    // 5. Tabela: tb_candidatos
    await queryRunner.createTable(new Table({
      name: "tb_candidatos",
      columns: [
        { name: "co_candidato", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_candidato", type: "varchar", isNullable: true },
        { name: "headline", type: "varchar", length: "200", isNullable: true },
        { name: "resumo", type: "text", isNullable: true },
        { name: "no_email", type: "varchar", length: "200", isNullable: true },
        { name: "nu_telefone", type: "varchar", length: "50", isNullable: true },
        { name: "dt_nascimento", type: "date", isNullable: true },
        { name: "no_localizacao", type: "varchar", length: "200", isNullable: true },
        { name: "url_foto", type: "varchar", length: "300", isNullable: true },
        { name: "co_cpf", type: "varchar", isNullable: false },
        { name: "dt_criado_em", type: "timestamp", default: "now()" },
        { name: "dt_atualizado_em", type: "timestamp", isNullable: true, default: "NULL" },
      ],
    }), true);

    // 6. Tabela: tb_funcao_candidatura
    await queryRunner.createTable(new Table({
      name: "tb_funcao_candidatura",
      columns: [
        { name: "co_funcao_candidatura", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_funcao", type: "int", isNullable: false },
        { name: "co_candidato", type: "int", isNullable: false },
      ],
    }), true);

    // 7. Tabela: tb_status
    await queryRunner.createTable(new Table({
      name: "tb_status",
      columns: [
        { name: "co_status", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_status", type: "varchar", isNullable: true },
        { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
      ],
    }), true);

    // 8. Tabela: tb_vagas
    await queryRunner.createTable(new Table({
      name: "tb_vagas",
      columns: [
        { name: "co_vaga", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_vaga", type: "varchar", isNullable: true },
        { name: "de_vaga", type: "text", isNullable: true },
        { name: "co_unidade", type: "int", isNullable: true },
        { name: "co_funcao", type: "int", isNullable: false },
        { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
        { name: "no_cidade_execucao", type: "varchar", length: "150", isNullable: true },
        { name: "no_area_atuacao", type: "varchar", length: "150", isNullable: true },
        { name: "vl_salario_min", type: "decimal", precision: 10, scale: 2, isNullable: true },
        { name: "vl_salario_max", type: "decimal", precision: 10, scale: 2, isNullable: true },
        { name: "tp_remuneracao", type: "varchar", length: "50", isNullable: true },
        { name: "de_beneficios", type: "text", isNullable: true },
        { name: "no_cidade", type: "varchar", length: "100", isNullable: true },
        { name: "no_estado", type: "varchar", length: "50", isNullable: true },
        { name: "tp_formato_trabalho", type: "varchar", length: "30", isNullable: true },
        { name: "tp_regime_contratacao", type: "varchar", length: "30", isNullable: true },
        { name: "no_nivel", type: "varchar", length: "30", isNullable: true },
        { name: "no_projeto", type: "varchar", length: "200", isNullable: true },
        { name: "dt_abertura", type: "date", isNullable: true },
        { name: "dt_encerramento", type: "date", isNullable: true },
        { name: "tp_vaga", type: "varchar", length: "30", isNullable: true },
        { name: "no_status", type: "varchar", length: "20", isNullable: true },
        { name: "co_usuario_cadastro", type: "int", isNullable: true }, 
        { name: "dt_criado_em", type: "timestamp", default: "now()" },
        { name: "co_usuario_atualizacao", type: "int", isNullable: true },
        { name: "dt_atualizado_em", type: "timestamp", isNullable: true, default: "NULL" },
      ],
    }), true);


    // 9. Tabela: tb_candidaturas
    await queryRunner.createTable(new Table({
      name: "tb_candidaturas",
      columns: [
        { name: "co_candidatura", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_vaga", type: "int", isNullable: false },
        { name: "co_funcao_candidatura", type: "int", isNullable: false },
        { name: "co_status", type: "int", isNullable: false },
        { name: "dt_criado_em", type: "timestamp", default: "now()" },
      ],
    }), true);

    // 10. Tabela: tb_status_agendado
    await queryRunner.createTable(new Table({
      name: "tb_status_agendado",
      columns: [
        { name: "co_status_agendado", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidatura", type: "int", isNullable: false },
        { name: "dt_status", type: "timestamp", isNullable: true }, 
      ],
    }), true);

    // 11. Tabela: tb_experiencia
    await queryRunner.createTable(new Table({
      name: "tb_experiencia",
      columns: [
        { name: "co_experiencia", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "no_cargo", type: "varchar", length: "200", isNullable: true },
        { name: "no_empresa", type: "varchar", length: "200", isNullable: true },
        { name: "tp_emprego", type: "varchar", length: "50", isNullable: true },
        { name: "no_localizacao", type: "varchar", length: "200", isNullable: true },
        { name: "ic_atual", type: "boolean", isNullable: true, default: "false" },
        { name: "dt_inicio", type: "date", isNullable: true },
        { name: "dt_fim", type: "date", isNullable: true },
        { name: "de_descricao", type: "text", isNullable: true },
      ],
    }), true);

    // 12. Tabela: tb_educacao
    await queryRunner.createTable(new Table({
      name: "tb_educacao",
      columns: [
        { name: "co_educacao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "no_instituicao", type: "varchar", length: "200", isNullable: true },
        { name: "no_curso", type: "varchar", length: "200", isNullable: true },
        { name: "no_nivel", type: "varchar", length: "100", isNullable: true },
        { name: "dt_inicio", type: "date", isNullable: true },
        { name: "dt_fim", type: "date", isNullable: true },
        { name: "de_descricao", type: "text", isNullable: true },
      ],
    }), true);

    // 13. Tabela: tb_skill
    await queryRunner.createTable(new Table({
      name: "tb_skill",
      columns: [
        { name: "co_skill", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_skill", type: "varchar", length: "100", isUnique: true, isNullable: false },
      ],
    }), true);

    // 14. Tabela: tb_candidato_skill
    await queryRunner.createTable(new Table({
      name: "tb_candidato_skill",
      columns: [
        { name: "co_candidato_skill", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "co_skill", type: "int", isNullable: false },
        { name: "nu_nivel", type: "int", isNullable: true },
      ],
    }), true);

    // 15. Tabela: tb_certificacao
    await queryRunner.createTable(new Table({
      name: "tb_certificacao",
      columns: [
        { name: "co_certificacao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "no_certificacao", type: "varchar", length: "200", isNullable: true },
        { name: "no_instituicao", type: "varchar", length: "200", isNullable: true },
        { name: "url_certificado", type: "varchar", length: "300", isNullable: true },
        { name: "dt_emissao", type: "date", isNullable: true },
        { name: "dt_validade", type: "date", isNullable: true },
      ],
    }), true);

    // 16. Tabela: tb_idioma
    await queryRunner.createTable(new Table({
      name: "tb_idioma",
      columns: [
        { name: "co_idioma", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "no_idioma", type: "varchar",  isNullable: true },
      ],
    }), true);

    // 17. Tabela: tb_candidato_idioma
    await queryRunner.createTable(new Table({
      name: "tb_candidato_idioma",
      columns: [
        { name: "co_candidato_idioma", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "co_idioma", type: "int",  isNullable: false },
        { name: "no_nivel", type: "varchar",  isNullable: true },
      ],
    }), true);

    // 18. Tabela: tb_projeto
    await queryRunner.createTable(new Table({
      name: "tb_projeto",
      columns: [
        { name: "co_projeto", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "no_projeto", type: "varchar", length: "200", isNullable: true },
        { name: "de_descricao", type: "text", isNullable: true },
        { name: "url_projeto", type: "varchar", length: "300", isNullable: true },
        { name: "dt_inicio", type: "date", isNullable: true },
        { name: "dt_fim", type: "date", isNullable: true },
      ],
    }), true);

    // 19. Tabela: tb_link
    await queryRunner.createTable(new Table({
      name: "tb_link",
      columns: [
        { name: "co_link", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "co_candidato", type: "int", isNullable: false },
        { name: "no_titulo", type: "varchar", length: "200", isNullable: true },
        { name: "url_link", type: "varchar", length: "300", isNullable: true },
      ],
    }), true);

    // 20. Criar o schema 'sc_bases'
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS sc_bases`);

    // 21. Tabela: tb_empregados
    await queryRunner.createTable(new Table({
      name: "sc_bases.tb_empregados",
      columns: [
      { name: "id_empregado", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
      { name: "co_matricula", type: "varchar", isNullable: false },
      { name: "co_matricula_cliente", type: "varchar", isNullable: true },
      { name: "no_nome", type: "varchar", length: "60", isNullable: true },
      { name: "co_cpf", type: "varchar", length: "20", isNullable: true },
      { name: "co_funcao", type: "varchar", isNullable: true },
      { name: "co_matricula_gestor_cliente", type: "varchar", isNullable: true },
      { name: "co_matricula_gestor_plansul", type: "varchar", isNullable: true },
      { name: "co_matricula_monitor_plansul", type: "varchar", isNullable: true },
      { name: "co_matricula_alteracao_plansul", type: "varchar", isNullable: true },
      { name: "nu_telefone", type: "varchar", isNullable: true },
      { name: "nu_telefone2", type: "varchar", isNullable: true },
      { name: "no_nome_social", type: "varchar", isNullable: true },
      { name: "ds_sexo", type: "varchar", length: "1", isNullable: true },
      { name: "nu_certificado", type: "varchar", isNullable: true },
      { name: "ds_dados_adicionais", type: "varchar", isNullable: true },
      { name: "nu_pis", type: "bigint", isNullable: true },
      { name: "nu_filial", type: "int", isNullable: true },
      { name: "id_situacao", type: "int", isNullable: true },
      { name: "ds_situacao", type: "varchar", isNullable: true },
      { name: "co_bairro", type: "int", isNullable: true },
      { name: "co_municipio", type: "int", isNullable: true },
      { name: "co_local_trabalho", type: "int", isNullable: true },
      { name: "dt_funcao", type: "date", isNullable: true },
      { name: "dt_nascimento", type: "date", isNullable: true },
      { name: "dt_admissao", type: "date", isNullable: true },
      { name: "dt_demissao", type: "date", isNullable: true },
      { name: "dt_situacao", type: "date", isNullable: true },
      { name: "dt_hist_alteracao", type: "date", isNullable: true },
      { name: "dt_alteracao", type: "timestamp", isNullable: true },
      { name: "hr_jornada_entrada", type: "time", isNullable: true },
      { name: "hr_jornada_saida", type: "time", isNullable: true },
      { name: "hr_descanso1", type: "time", isNullable: true },
      { name: "hr_descanso2", type: "time", isNullable: true },
      { name: "hr_lanche", type: "time", isNullable: true },
      { name: "ic_certificado_digital", type: "boolean", isNullable: true },
      ],
    }));


    // 22. Foreign Keys

    // FKs para tb_vagas
    await queryRunner.createForeignKeys("tb_vagas", [
      new TableForeignKey({
        columnNames: ["co_unidade"],
        referencedTableName: "gestao.tb_unidades",
        referencedColumnNames: ["co_unidade"],
      }),
      new TableForeignKey({
        columnNames: ["co_funcao"],
        referencedTableName: "tb_funcoes",
        referencedColumnNames: ["co_funcao"],
      }),
      // FK para co_usuario_cadastro
      new TableForeignKey({
        columnNames: ["co_usuario_cadastro"],
        referencedTableName: "gestao.tb_usuarios",
        referencedColumnNames: ["co_usuario"],
        // OnDelete: "SET NULL", // Adicionar se necessário (exemplo)
      }),
      // FK para co_usuario_atualizacao
      new TableForeignKey({
        columnNames: ["co_usuario_atualizacao"],
        referencedTableName: "gestao.tb_usuarios",
        referencedColumnNames: ["co_usuario"],
        // OnDelete: "SET NULL", // Adicionar se necessário (exemplo)
      }),
    ]);

    // FKs para tb_funcao_candidatura
    await queryRunner.createForeignKeys("tb_funcao_candidatura", [
      new TableForeignKey({
        columnNames: ["co_funcao"],
        referencedTableName: "tb_funcoes",
        referencedColumnNames: ["co_funcao"],
      }),
      new TableForeignKey({
        columnNames: ["co_candidato"],
        referencedTableName: "tb_candidatos",
        referencedColumnNames: ["co_candidato"],
      }),
    ]);

    // FKs para tb_candidaturas
    await queryRunner.createForeignKeys("tb_candidaturas", [
      new TableForeignKey({
        columnNames: ["co_vaga"],
        referencedTableName: "tb_vagas",
        referencedColumnNames: ["co_vaga"],
      }),
      new TableForeignKey({
        columnNames: ["co_funcao_candidatura"],
        referencedTableName: "tb_funcao_candidatura",
        referencedColumnNames: ["co_funcao_candidatura"],
      }),
      new TableForeignKey({
        columnNames: ["co_status"],
        referencedTableName: "tb_status",
        referencedColumnNames: ["co_status"],
      }),
    ]);

    // FK para tb_status_agendado
    await queryRunner.createForeignKey("tb_status_agendado", new TableForeignKey({
      columnNames: ["co_candidatura"],
      referencedTableName: "tb_candidaturas",
      referencedColumnNames: ["co_candidatura"],
    }));

    // FKs para tabelas relacionadas ao candidato (Experiência, Educação, Skill, Certificação, Idioma, Projeto, Link)
    const tablesWithCandidateFK = [
      "tb_experiencia",
      "tb_educacao",
      "tb_candidato_skill",
      "tb_certificacao",
      "tb_candidato_idioma",
      //estava tb_idioma
      "tb_projeto",
      "tb_link",
    ];

    for (const tableName of tablesWithCandidateFK) {
      await queryRunner.createForeignKey(tableName, new TableForeignKey({
        columnNames: ["co_candidato"],
        referencedTableName: "tb_candidatos",
        referencedColumnNames: ["co_candidato"],
      }));
    }

    // FKs adicionais para tb_candidato_skill
    await queryRunner.createForeignKey("tb_candidato_skill", new TableForeignKey({
      columnNames: ["co_skill"],
      referencedTableName: "tb_skill",
      referencedColumnNames: ["co_skill"],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Dropar todas as tabelas na ordem reversa, começando pelas que têm FKs.

    // Remover FKs de tb_vagas
    const vagasTable = await queryRunner.getTable("tb_vagas");
    const vagasFks = vagasTable?.foreignKeys;
    if (vagasFks) {
      await queryRunner.dropForeignKeys("tb_vagas", vagasFks);
    }

    // Remover FKs de tb_funcao_candidatura
    const funcaoCandidaturaTable = await queryRunner.getTable("tb_funcao_candidatura");
    const funcaoCandidaturaFks = funcaoCandidaturaTable?.foreignKeys;
    if (funcaoCandidaturaFks) {
      await queryRunner.dropForeignKeys("tb_funcao_candidatura", funcaoCandidaturaFks);
    }

    // Remover FKs de tb_candidaturas
    const candidaturasTable = await queryRunner.getTable("tb_candidaturas");
    const candidaturasFks = candidaturasTable?.foreignKeys;
    if (candidaturasFks) {
      await queryRunner.dropForeignKeys("tb_candidaturas", candidaturasFks);
    }

    // Remover FK de tb_status_agendado
    const statusAgendadoTable = await queryRunner.getTable("tb_status_agendado");
    const statusAgendadoFk = statusAgendadoTable?.foreignKeys.find(fk => fk.columnNames.indexOf("co_candidatura") !== -1);
    if (statusAgendadoFk) {
      await queryRunner.dropForeignKey("tb_status_agendado", statusAgendadoFk);
    }

    // Remover FKs de tabelas relacionadas ao candidato
    const tablesWithCandidateFK = [
      "tb_experiencia",
      "tb_educacao",
      "tb_candidato_skill",
      "tb_certificacao",
      "tb_idioma",
      "tb_projeto",
      "tb_link",
    ];

    for (const tableName of tablesWithCandidateFK) {
      const table = await queryRunner.getTable(tableName);
      const fk = table?.foreignKeys.find(fk => fk.columnNames.indexOf("co_candidato") !== -1);
      if (fk) {
        await queryRunner.dropForeignKey(tableName, fk);
      }
    }

    // Remover FK adicional de tb_candidato_skill (co_skill)
    const candidatoSkillTable = await queryRunner.getTable("tb_candidato_skill");
    const skillFk = candidatoSkillTable?.foreignKeys.find(fk => fk.columnNames.indexOf("co_skill") !== -1);
    if (skillFk) {
      await queryRunner.dropForeignKey("tb_candidato_skill", skillFk);
    }

    // Dropar as tabelas
    await queryRunner.dropTable("tb_link", true);
    await queryRunner.dropTable("tb_projeto", true);
    await queryRunner.dropTable("tb_idioma", true);
    await queryRunner.dropTable("tb_certificacao", true);
    await queryRunner.dropTable("tb_candidato_skill", true);
    await queryRunner.dropTable("tb_skill", true);
    await queryRunner.dropTable("tb_educacao", true);
    await queryRunner.dropTable("tb_experiencia", true);
    await queryRunner.dropTable("tb_status_agendado", true);
    await queryRunner.dropTable("tb_candidaturas", true);
    await queryRunner.dropTable("tb_vagas", true);
    await queryRunner.dropTable("tb_status", true);
    await queryRunner.dropTable("tb_funcao_candidatura", true);
    await queryRunner.dropTable("tb_candidatos", true);
    await queryRunner.dropTable("tb_funcoes", true);
    await queryRunner.dropTable("gestao.tb_unidades", true);
    await queryRunner.dropTable("gestao.tb_usuarios", true); 
    await queryRunner.dropTable("sc_bases.tb_empregados", true);
  }
}