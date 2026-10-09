import { DataSource, DeepPartial } from 'typeorm';
import { Status } from '../modules/status/status.entity'; // Assumindo o caminho

export async function seedStatus(dataSource: DataSource) {
  const repo = dataSource.getRepository(Status);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Status já existentes, seed ignorado.');
    return;
  }

  const statusData: DeepPartial<Status>[] = [
    { coStatus: 1, noStatus: 'Agendado', icSituacaoAtivo: true }, // Importante para a lógica de Candidaturas
    { coStatus: 2, noStatus: 'Em Análise', icSituacaoAtivo: true },
    { coStatus: 3, noStatus: 'Entrevista', icSituacaoAtivo: true },
    { coStatus: 4, noStatus: 'Contratado', icSituacaoAtivo: true },
    { coStatus: 5, noStatus: 'Rejeitado', icSituacaoAtivo: true },
  ];

  // Força o ID para garantir referências em outras tabelas
  for (const data of statusData) {
    await repo.save(repo.create(data));
  }
  
  console.log('Status inseridos com sucesso!');
}