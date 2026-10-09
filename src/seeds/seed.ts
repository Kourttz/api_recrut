import { DataSource } from "typeorm";
import { AppDataSource } from "../../data_source";
import { seedUnidades } from "./unidades.seed";
import { seedUsuarios } from "./usuarios.seed";
import { seedFuncoes } from "./funcoes.seed";

// Importando os novos seeds
import { seedStatus } from "./status.seed";
import { seedCandidatos } from "./candidatos.seed";
import { seedSkill } from "./skill.seed";
import { seedVagas } from "./vagas.seed";
import { seedCandidatoSkill } from "./candidato_skill.seed";
import { seedFuncaoCandidatura } from "./funcao_candidatura.seed";
import { seedCandidaturas } from "./candidaturas.seed";
import { seedStatusAgendado } from "./status_agendado.seed";

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    // console.log("📦 Conexão com banco estabelecida!");

    // SEEDS DE BASE (já existentes)
    // await seedUnidades(AppDataSource);
    // await seedUsuarios(AppDataSource);
    // await seedFuncoes(AppDataSource);

    // NOVOS SEEDS DE BASE
    // await seedStatus(AppDataSource);
    // await seedCandidatos(AppDataSource);
    // await seedSkill(AppDataSource);

    // SEEDS PRINCIPAIS (com FKs)
    // await seedVagas(AppDataSource); // Depende de Unidades, Funcoes, Usuarios
    
    // SEEDS DE RELACIONAMENTO/COMPLEMENTARES
    // await seedCandidatoSkill(AppDataSource); // Depende de Candidatos, Skill
    // await seedFuncaoCandidatura(AppDataSource); // Depende de Candidatos, Funcoes
    
    // SEEDS DE FLUXO
    // await seedCandidaturas(AppDataSource); // Depende de Vagas, FuncaoCandidatura, Status
    // await seedStatusAgendado(AppDataSource); // Depende de Candidaturas

    // console.log("✅ Seeds concluídos!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao executar seeds:", err);
    process.exit(1);
  }
}

runSeeds();