import { DataSource, DeepPartial } from 'typeorm';
import { Candidatos } from '../modules/candidatos/candidatos.entity'; // Assumindo o caminho

export async function seedCandidatos(dataSource: DataSource) {
  const repo = dataSource.getRepository(Candidatos);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Candidatos já existentes, seed ignorado.');
    return;
  }

  const candidatosData: DeepPartial<Candidatos>[] = [
    {
      coCandidato: 1,
      noCandidato: 'Mariana Lima Santos',
      headline: 'Desenvolvedora Full Stack em busca de desafios',
      resumo: 'Especialista em Node.js e React com 5 anos de experiência.',
      noEmail: 'mariana.santos@email.com',
      nuTelefone: '41998887777',
      dtNascimento: new Date('1995-05-15'),
      noLocalizacao: 'Curitiba, PR',
      urlFoto: 'http://link.foto/mariana',
      coCpf: '11122233344',
    },
    {
      coCandidato: 2,
      noCandidato: 'Pedro Henrique Almeida',
      headline: 'Analista de Dados Júnior',
      resumo: 'Recém-formado em Ciência da Computação com foco em Python e SQL.',
      noEmail: 'pedro.almeida@email.com',
      nuTelefone: '11987654321',
      dtNascimento: new Date('2003-11-20'),
      noLocalizacao: 'São Paulo, SP',
      urlFoto: 'http://link.foto/pedro',
      coCpf: '55566677788',
    },
  ];

  for (const data of candidatosData) {
    await repo.save(repo.create(data));
  }
  
  console.log('Candidatos inseridos com sucesso!');
}