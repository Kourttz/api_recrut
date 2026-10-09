import { DataSource, DeepPartial } from 'typeorm';
import { StatusAgendado } from '../modules/status_agendado/status_agendado.entity'; // Assumindo o caminho

export async function seedStatusAgendado(dataSource: DataSource) {
  const repo = dataSource.getRepository(StatusAgendado);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('StatusAgendado já existente, seed ignorado.');
    return;
  }

  const statusAgendadoData: DeepPartial<StatusAgendado>[] = [
    // Apenas a candidatura 1, que tem coStatus = 1 (Agendado)
    {
      coCandidatura: 1,
      // Exemplo: Mariana não tem todos os requisitos hoje, mas terá em 2026.
      dtStatus: new Date('2026-03-01'), 
    },
  ];

  await repo.save(repo.create(statusAgendadoData));
  
  console.log('StatusAgendados inseridos com sucesso!');
}