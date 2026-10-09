import { DataSource, DeepPartial } from 'typeorm';
import { Candidaturas } from '../modules/candidaturas/candidaturas.entity'; // Assumindo o caminho

export async function seedCandidaturas(dataSource: DataSource) {
  const repo = dataSource.getRepository(Candidaturas);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Candidaturas já existentes, seed ignorado.');
    return;
  }

  const candidaturasData: DeepPartial<Candidaturas>[] = [
    {
      coCandidatura: 1,
      coVaga: 1, // Desenvolvedor Full Stack Sênior
      coFuncaoCandidatura: 1, // Mariana (Função 1)
      coStatus: 1, // Agendado (Ato de agendamento de contato futuro)
    },
    {
      coCandidatura: 2,
      coVaga: 2, // Estágio em Análise de Dados
      coFuncaoCandidatura: 2, // Pedro (Função 4)
      coStatus: 2, // Em Análise
    },
  ];

  for (const data of candidaturasData) {
    await repo.save(repo.create(data));
  }

  console.log('Candidaturas inseridas com sucesso!');
}