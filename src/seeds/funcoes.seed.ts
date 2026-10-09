import { DataSource } from "typeorm";
import { Funcoes } from "../modules/funcoes/funcoes.entity";

export async function seedFuncoes(dataSource: DataSource) {
  const repo = dataSource.getRepository(Funcoes);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log("Funções já existentes, seed ignorado.");
    return;
  }

  const funcoesData: Partial<Funcoes>[] = [
    { noFuncao: "Desenvolvedor(a) Full Stack Junior", icSituacaoAtivo: true },
    { noFuncao: "Analista de RH Pleno", icSituacaoAtivo: true },
    { noFuncao: "Gerente de Projetos Senior", icSituacaoAtivo: true },
    { noFuncao: "Designer UX/UI", icSituacaoAtivo: true },
    { noFuncao: "Coordenador(a) Administrativo", icSituacaoAtivo: false },
  ];

  const funcoes = repo.create(funcoesData as Funcoes[]);

  await repo.save(funcoes);
  console.log("Funções inseridas com sucesso!");
}