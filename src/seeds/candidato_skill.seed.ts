import { DataSource, DeepPartial } from 'typeorm';
import { CandidatoSkill } from '../modules/candidato_skill/candidato_skill.entity';

export async function seedCandidatoSkill(dataSource: DataSource) {
  const repo = dataSource.getRepository(CandidatoSkill);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('CandidatoSkill já existente, seed ignorado.');
    return;
  }

  const candidatoSkillData: DeepPartial<CandidatoSkill>[] = [
 
    {
      nuNivel: 5,
      candidato: { coCandidato: 1 },
      skill: { coSkill: 1 }, // Node.js
    },
    {
      nuNivel: 4,
      candidato: { coCandidato: 1 },
      skill: { coSkill: 2 }, // React
    },

    {
      nuNivel: 3,
      candidato: { coCandidato: 2 },
      skill: { coSkill: 4 }, // Python
    },
    {
      nuNivel: 4,
      candidato: { coCandidato: 2 },
      skill: { coSkill: 3 }, // SQL
    },
  ];

  await repo.save(repo.create(candidatoSkillData));

  console.log('CandidatoSkills inseridos com sucesso!');
}
