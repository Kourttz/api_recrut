import { DataSource, DeepPartial } from 'typeorm';
import { Skill } from '../modules/skill/skill.entity'; // Assumindo o caminho

export async function seedSkill(dataSource: DataSource) {
  const repo = dataSource.getRepository(Skill);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Skills já existentes, seed ignorado.');
    return;
  }

  const skillsData: DeepPartial<Skill>[] = [
    { coSkill: 1, noSkill: 'Node.js' },
    { coSkill: 2, noSkill: 'React' },
    { coSkill: 3, noSkill: 'SQL' },
    { coSkill: 4, noSkill: 'Python' },
    { coSkill: 5, noSkill: 'UX/UI Design' },
  ];

  for (const data of skillsData) {
    await repo.save(repo.create(data));
  }
  
  console.log('Skills inseridas com sucesso!');
}