import { DataSource, DeepPartial } from 'typeorm';
import { FuncaoCandidatura } from '../modules/funcao_candidatura/funcao_candidatura.entity'; // Assumindo o caminho

export async function seedFuncaoCandidatura(dataSource: DataSource) {
  const repo = dataSource.getRepository(FuncaoCandidatura);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('FuncaoCandidatura já existente, seed ignorado.');
    return;
  }

  const funcaoCandidaturaData: DeepPartial<FuncaoCandidatura>[] = [
    {
      coFuncaoCandidatura: 1,
      coFuncao: 1, // Desenvolvedor(a) Full Stack Junior
      coCandidato: 1, // Mariana
    },
    {
      coFuncaoCandidatura: 2,
      coFuncao: 4, // Designer UX/UI (Apenas um exemplo de função principal do candidato)
      coCandidato: 2, // Pedro
    },
  ];
  
  // Força o ID para referenciar em tb_candidaturas
  for (const data of funcaoCandidaturaData) {
    await repo.save(repo.create(data));
  }

  console.log('FuncaoCandidaturas inseridas com sucesso!');
}