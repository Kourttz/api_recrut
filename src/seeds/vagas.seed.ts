import { DataSource, DeepPartial } from 'typeorm';
import { Vagas } from '../modules/vagas/vagas.entity'; // Assumindo o caminho

export async function seedVagas(dataSource: DataSource) {
  const repo = dataSource.getRepository(Vagas);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Vagas já existentes, seed ignorado.');
    return;
  }

  const vagasData: DeepPartial<Vagas>[] = [
    {
      coVaga: 1,
      noVaga: 'Desenvolvedor Full Stack Sênior',
      deVaga: 'Vaga para atuar em projetos críticos utilizando tecnologias de ponta...',
      coUnidade: 1, // Sede - Curitiba (de unidades.seed.ts)
      coFuncao: 1,  // Desenvolvedor(a) Full Stack Junior (de funcoes.seed.ts - Ajustar para Sênior, usando o ID 1)
      icSituacaoAtivo: true,
      noCidadeExecucao: 'Curitiba',
      noAreaAtuacao: 'Desenvolvimento',
      vlSalarioMin: 8000.00,
      vlSalarioMax: 12000.00,
      tpRemuneracao: 'CLT + Benefícios',
      deBeneficios: 'VA, VR, Plano de Saúde, PLR',
      noCidade: 'Curitiba',
      noEstado: 'PR',
      tpFormatoTrabalho: 'Híbrido',
      tpRegimeContratacao: 'CLT',
      noNivel: 'Sênior',
      dtAbertura: new Date('2025-11-01'),
      dtEncerramento: new Date('2026-01-30'),
      tpVaga: 'Externa',
      noStatus: 'Aberta',
      coUsuarioCadastro: 1, // Renato (de usuarios.seed.ts)
    },
    {
      coVaga: 2,
      noVaga: 'Estágio em Análise de Dados',
      deVaga: 'Oportunidade para estudantes de Ciência de Dados ou áreas correlatas.',
      coUnidade: 2, // Filial - São Paulo
      coFuncao: 4,  // Designer UX/UI (de funcoes.seed.ts - Usando o ID 4 para evitar criar mais funções)
      icSituacaoAtivo: true,
      noCidadeExecucao: 'São Paulo',
      noAreaAtuacao: 'Dados',
      vlSalarioMin: 1500.00,
      vlSalarioMax: 2000.00,
      tpRemuneracao: 'Bolsa Auxílio + Benefícios',
      deBeneficios: 'VA, VT',
      noCidade: 'São Paulo',
      noEstado: 'SP',
      tpFormatoTrabalho: 'Remoto',
      tpRegimeContratacao: 'Estágio',
      noNivel: 'Estágio',
      dtAbertura: new Date('2025-12-01'),
      dtEncerramento: new Date('2026-03-01'),
      tpVaga: 'Interna',
      noStatus: 'Aberta',
      coUsuarioCadastro: 2, // Noan (de usuarios.seed.ts)
    },
  ];

  for (const data of vagasData) {
    await repo.save(repo.create(data));
  }

  console.log('Vagas inseridas com sucesso!');
}