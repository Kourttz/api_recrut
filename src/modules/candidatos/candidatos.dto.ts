import { 
    IsString, IsBoolean, IsOptional, IsInt, IsNotEmpty, IsDateString, 
    ValidateNested, IsArray, IsNumber 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  // --- Sub-DTOs para os itens filhos (Mantidos) ---
  
  export class CriarExperienciaDto {
    @ApiProperty() @IsString() noCargo: string;
    @ApiProperty() @IsString() noEmpresa: string;
    @ApiPropertyOptional() @IsString() @IsOptional() tpEmprego?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noLocalizacao?: string;
    @ApiPropertyOptional() @IsBoolean() @IsOptional() icAtual?: boolean;
    @ApiProperty() @IsDateString() dtInicio: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtFim?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() deDescricao?: string;
  }

  export class AtualizarExperienciaDto {
    @ApiProperty() @IsNumber() coExperiencia: number;
    @ApiProperty() @IsString() noCargo?: string;
    @ApiProperty() @IsString() noEmpresa?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() tpEmprego?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noLocalizacao?: string;
    @ApiPropertyOptional() @IsBoolean() @IsOptional() icAtual?: boolean;
    @ApiProperty() @IsDateString() dtInicio?: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtFim?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() deDescricao?: string;
  }
  
  export class CriarEducacaoDto {
    @ApiProperty() @IsString() noInstituicao: string;
    @ApiProperty() @IsString() noCurso: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noNivel?: string;
    @ApiProperty() @IsDateString() dtInicio: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtFim?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() deDescricao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noStatus?: string;
  }

  export class AtualizarEducacaoDto {
    @ApiProperty() @IsNumber() coEducacao: number;
    @ApiProperty() @IsString() noInstituicao?: string;
    @ApiProperty() @IsString() noCurso?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noNivel?: string;
    @ApiProperty() @IsDateString() dtInicio?: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtFim?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() deDescricao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noStatus?: string;
  }
  
  export class CriarCertificacaoDto {
    @ApiProperty() @IsString() noCertificacao: string;
    @ApiProperty() @IsString() noInstituicao: string;
    @ApiPropertyOptional() @IsString() @IsOptional() urlCertificado?: string;
    @ApiProperty() @IsDateString() dtEmissao: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtValidade?: string;
  }

  export class AtualizarCertificacaoDto {
    @ApiProperty() @IsNumber() coCertificacao: number;
    @ApiProperty() @IsString() noCertificacao?: string;
    @ApiProperty() @IsString() noInstituicao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() urlCertificado?: string;
    @ApiProperty() @IsDateString() dtEmissao?: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtValidade?: string;
  }
  
  export class CriarIdiomaDto {
    @ApiProperty() @IsNumber() coIdioma: number;
    @ApiPropertyOptional() @IsString() @IsOptional() noNivel?: string;
  }
  
  
  export class CriarProjetoDto {
    @ApiProperty() @IsString() noProjeto: string;
    @ApiPropertyOptional() @IsString() @IsOptional() deDescricao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() urlProjeto?: string;
    @ApiProperty() @IsDateString() dtInicio: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtFim?: string;
  }

  export class AtualizarProjetoDto {
    @ApiProperty() @IsNumber() coProjeto: number;
    @ApiProperty() @IsString() noProjeto?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() deDescricao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() urlProjeto?: string;
    @ApiProperty() @IsDateString() dtInicio?: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtFim?: string;
  }
  
  export class CriarLinkDto {
    @ApiProperty() @IsString() noTitulo: string;
    @ApiProperty() @IsString() urlLink: string;
  }

  export class AtualizarLinkDto {
    @ApiProperty() @IsNumber() coLink: number;
    @ApiProperty() @IsString() noTitulo?: string;
    @ApiProperty() @IsString() urlLink?: string;
  }
  
  // --- NOVO SUB-DTO para a Entity de Junção (Skills) ---
  export class CriarCandidatoSkillDto {
    @ApiProperty({ description: 'Nome da Skill. Se não existir, será criada na tb_skill.' }) 
    @IsString() @IsNotEmpty() noSkill: string; 
  
    @ApiProperty({ description: 'Nível de proficiência (ex: 1=Básico a 5=Expert)', minimum: 1, maximum: 5 }) 
    @IsInt() @IsNotEmpty() nuNivel: number;
  }
  
  
  // --- DTO Principal de Criação ---
  
  export class CriarCandidatoDto {
    // Dados Pessoais
    @ApiProperty() @IsString() @IsNotEmpty() noCandidato: string;
    @ApiPropertyOptional() @IsString() @IsOptional() headline?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() resumo?: string;
    @ApiProperty() @IsString() @IsNotEmpty() noEmail: string;
    @ApiPropertyOptional() @IsString() @IsOptional() nuTelefone?: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtNascimento?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noLocalizacao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() urlFoto?: string;
    @ApiProperty() @IsString() @IsNotEmpty() coCpf: string;
  
    // Listas (Nested)
    @ApiPropertyOptional({ type: [CriarExperienciaDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarExperienciaDto)
    experiencias?: CriarExperienciaDto[];
  
    @ApiPropertyOptional({ type: [CriarEducacaoDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarEducacaoDto)
    educacoes?: CriarEducacaoDto[];
  
    @ApiPropertyOptional({ type: [CriarCertificacaoDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarCertificacaoDto)
    certificacoes?: CriarCertificacaoDto[];
  
    @ApiPropertyOptional({ type: [CriarIdiomaDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarIdiomaDto)
    idiomas?: CriarIdiomaDto[];
  
    @ApiPropertyOptional({ type: [CriarProjetoDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarProjetoDto)
    projetos?: CriarProjetoDto[];
  
    @ApiPropertyOptional({ type: [CriarLinkDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarLinkDto)
    links?: CriarLinkDto[];
    
    // NOVO CAMPO: Skills com Nível
    @ApiPropertyOptional({ type: [CriarCandidatoSkillDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarCandidatoSkillDto)
    candidatoSkills?: CriarCandidatoSkillDto[]; 
  }
  
  // --- DTO para Atualização Completa ---
  export class AtualizarCandidatoDto {
    // Dados Pessoais Básicos
    @ApiPropertyOptional() @IsString() @IsOptional() noCandidato?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() headline?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() resumo?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noEmail?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() nuTelefone?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() noLocalizacao?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() urlFoto?: string;
    @ApiPropertyOptional() @IsString() @IsOptional() coCpf?: string;
    @ApiPropertyOptional() @IsDateString() @IsOptional() dtNascimento?: string;
  
    // Listas (Nested)
    @ApiPropertyOptional({ type: [AtualizarExperienciaDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => AtualizarExperienciaDto)
    experiencias?: AtualizarExperienciaDto[];
  
    @ApiPropertyOptional({ type: [AtualizarEducacaoDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => AtualizarEducacaoDto)
    educacoes?: AtualizarEducacaoDto[];
  
    @ApiPropertyOptional({ type: [AtualizarCertificacaoDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => AtualizarCertificacaoDto)
    certificacoes?: AtualizarCertificacaoDto[];
  
    @ApiPropertyOptional({ type: [CriarIdiomaDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarIdiomaDto)
    idiomas?: CriarIdiomaDto[];
  
    @ApiPropertyOptional({ type: [AtualizarProjetoDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => AtualizarProjetoDto)
    projetos?: AtualizarProjetoDto[];
  
    @ApiPropertyOptional({ type: [AtualizarLinkDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => AtualizarLinkDto)
    links?: AtualizarLinkDto[];
  
    // NOVO CAMPO: Skills com Nível
    @ApiPropertyOptional({ type: [CriarCandidatoSkillDto] })
    @IsArray() @IsOptional() @ValidateNested({ each: true })
    @Type(() => CriarCandidatoSkillDto)
    candidatoSkills?: CriarCandidatoSkillDto[]; 
  }
  
  
  // --- DTO BÁSICO PARA CRIAÇÃO DE UMA SKILL (tb_skill) ---
  export class CriarSkillDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    noSkill: string;
  }
  
  // --- MOCKS PARA SWAGGER E TESTES ---
  
  /**
   * MOCK de dados para a tabela tb_skill (para referência e CRUD de Skills).
   * Estes são os nomes que devem ser usados no noSkill dos candidatos.
   */
  export const MOCK_SKILLS_EXISTENTES: CriarSkillDto[] & { coSkill: number }[] = [
    { coSkill: 1, noSkill: 'NestJS' },
    { coSkill: 2, noSkill: 'React' },
    { coSkill: 3, noSkill: 'AWS S3' },
    { coSkill: 4, noSkill: 'TypeScript' },
    { coSkill: 5, noSkill: 'PostgreSQL' },
    { coSkill: 6, noSkill: 'Kubernetes' },
  ];
    
  /**
   * MOCK completo para a criação de um novo candidato.
   */
  export const MOCK_CRIAR_CANDIDATO_COMPLETO: CriarCandidatoDto = {
    noCandidato: 'Mariana Silva Oliveira',
    headline: 'Desenvolvedora Full-Stack Sênior | Especialista em NestJS e React',
    resumo: 'Profissional com 8 anos de experiência em desenvolvimento de software, focada em arquitetura de microserviços e alta performance.',
    noEmail: 'mariana.oliveira@dev.com.br',
    nuTelefone: '+55 41 98765-4321',
    dtNascimento: '1990-05-15',
    noLocalizacao: 'Curitiba, PR, Brasil',
    urlFoto: 'https://cdn.link.com/marianas_foto.jpg',
    coCpf: '12345678901', 
  
    // --- EXPERIÊNCIAS EXPANDIDAS ---
    experiencias: [
      {
        noCargo: 'Desenvolvedora Full-Stack Sênior',
        noEmpresa: 'Tech Solutions Ltda',
        tpEmprego: 'Tempo Integral',
        noLocalizacao: 'São Paulo, SP',
        icAtual: true,
        dtInicio: '2020-03-01',
        deDescricao: 'Liderança técnica em projeto de e-commerce, migração para microserviços em NestJS, otimização de performance front-end com React e mentoria de desenvolvedores juniores.',
      },
      {
        noCargo: 'Desenvolvedora Júnior',
        noEmpresa: 'Startup Inovadora',
        tpEmprego: 'Tempo Integral',
        noLocalizacao: 'Curitiba, PR',
        icAtual: false,
        dtInicio: '2018-01-10',
        dtFim: '2020-02-28',
        deDescricao: 'Desenvolvimento de novas funcionalidades em APIs RESTful usando Java e Spring Boot. Participação em reuniões de design de software e testes de integração.'
      }
    ],
  
    // --- EDUCAÇÕES EXPANDIDAS ---
    educacoes: [
      {
        noInstituicao: 'Universidade Federal do Paraná (UFPR)',
        noCurso: 'Mestrado em Engenharia de Software',
        noNivel: 'Pós-Graduação',
        dtInicio: '2018-03-01',
        dtFim: '2019-12-15',
        deDescricao: 'Pesquisa focada em arquitetura de sistemas distribuídos e padrões de comunicação assíncrona.',
        noStatus: 'Concluído'
      },
      {
        noInstituicao: 'Universidade Federal do Paraná (UFPR)',
        noCurso: 'Bacharelado em Ciência da Computação',
        noNivel: 'Graduação',
        dtInicio: '2013-02-01',
        dtFim: '2017-12-15',
        deDescricao: 'Ênfase em algoritmos avançados e estrutura de dados.',
        noStatus: 'Cursando'
      },
      {
        noInstituicao: 'SENAC',
        noCurso: 'Técnico em Redes de Computadores',
        noNivel: 'Técnico',
        dtInicio: '2012-01-01',
        dtFim: '2012-12-30',
        deDescricao: 'Curso de curta duração focado em topologia de redes, TCP/IP e segurança básica.',
        noStatus: 'Trancado'
      },
    ],
  
    // --- CERTIFICAÇÕES EXPANDIDAS ---
    certificacoes: [
      {
        noCertificacao: 'AWS Certified Developer - Associate',
        noInstituicao: 'Amazon Web Services (AWS)',
        urlCertificado: 'https://cert.link/aws_dev_mariana',
        dtEmissao: '2022-07-20',
        dtValidade: '2025-07-20',
      },
      {
        noCertificacao: 'Professional Scrum Master I (PSM I)',
        noInstituicao: 'Scrum.org',
        urlCertificado: 'https://cert.link/psm1_mariana',
        dtEmissao: '2023-11-05',
      },
    ],
  
    idiomas: [
      {
        coIdioma: 1,
        noNivel: 'Nativo',
      },
      {
        coIdioma: 2,
        noNivel: 'Avançado (C1)',
      },
    ],
  
    projetos: [
      {
        noProjeto: 'Plataforma Open Source de Doações',
        deDescricao: 'Sistema de gerenciamento de doações para ONGs, utilizando React e GraphQL.',
        urlProjeto: 'https://github.com/mariana_dev/doacoes-oss',
        dtInicio: '2023-01-01',
        dtFim: '2023-08-30',
      },
    ],
  
    links: [
      {
        noTitulo: 'LinkedIn',
        urlLink: 'https://linkedin.com/in/mariana-oliveira-dev',
      },
    ],
  
    // Skills (usando o nome da skill, que será criada se não existir)
    candidatoSkills: [
      { noSkill: 'NestJS', nuNivel: 5 }, 
      { noSkill: 'React', nuNivel: 4 }, 
      { noSkill: 'Terraform', nuNivel: 3 }, 
    ],
  };
  
  
  /**
   * MOCK parcial para atualização de candidato.
   * Demonstra a substituição e edição de várias listas aninhadas.
   */
  export const MOCK_ATUALIZAR_CANDIDATO_PARCIAL: AtualizarCandidatoDto = {
    // Alteração de dados principais
    headline: 'Especialista em Microserviços | Sênior Full-Stack | Cloud & DevOps',
    
    // 1. Atualização de Experiências (Substituição/Edição)
    experiencias: [
      {
        // Item existente no mock de criação (deve ter o ID do item antigo no DB se for atualização)
        coExperiencia: 1,
        noCargo: 'Desenvolvedora Full-Stack Sênior',
        noEmpresa: 'Tech Solutions Ltda',
        tpEmprego: 'Tempo Integral',
        noLocalizacao: 'São Paulo, SP',
        icAtual: true,
        dtInicio: '2020-03-01',
        // DESCRIÇÃO ALTERADA
        deDescricao: 'Liderança técnica em projeto de e-commerce, com foco em otimização de infraestrutura AWS, NestJS e migração para arquitetura serverless.', 
      },
      {
        coExperiencia: 2,
        noCargo: 'Desenvolvedora Júnior',
        noEmpresa: 'Startup Inovadora',
        tpEmprego: 'Tempo Integral',
        noLocalizacao: 'Curitiba, PR',
        icAtual: false,
        dtInicio: '2018-01-10',
        dtFim: '2020-02-28',
        deDescricao: 'Desenvolvimento de APIs RESTful usando Java e Spring Boot.'
      }
    ],
    
    // 2. Atualização de Certificações (Adição)
    certificacoes: [
       // Manter a certificação anterior (AWS)
      { 
        coCertificacao: 1,
        noCertificacao: 'AWS Certified Developer - Associate',
        noInstituicao: 'Amazon Web Services (AWS)',
        urlCertificado: 'https://cert.link/aws_dev_mariana',
        dtEmissao: '2022-07-20',
        dtValidade: '2025-07-20',
      },
      // Adicionar nova certificação
      { 
        coCertificacao: 2,
        noCertificacao: 'Certified Kubernetes Administrator (CKA)',
        noInstituicao: 'Cloud Native Computing Foundation (CNCF)',
        urlCertificado: 'https://cert.link/cka_mariana',
        dtEmissao: '2025-01-10',
      },
    ],
    
    // 3. Skills (Adicionando/Removendo)
    candidatoSkills: [
      { noSkill: 'NestJS', nuNivel: 5 }, 
      { noSkill: 'Kubernetes', nuNivel: 4 }, 
    ],
  
    // 4. Links (Substituição)
    links: [
      { 
        coLink: 1,
        noTitulo: 'Medium Blog',
        urlLink: 'https://medium.com/@mariana.oliveira.dev',
      },
      {
        coLink: 2,
        noTitulo: 'GitHub', 
        urlLink: 'https://github.com/mariana_dev',
      },
    ],
  };

  export const MOCK_ATUALIZAR_CANDIDATO_DELETE_ALL = {
    experiencias: {
      _deleteAll: true
    },
    certificacoes: {
      _deleteAll: true
    },
    projetos: {
      _deleteAll: true
    }
  };
  
  
  export const MOCK_ATUALIZAR_CANDIDATO_DELETE_GROUP = {
    experiencias: {
      _deleteGroup: true,
      items: [
        { coExperiencia: 5 },
        { coExperiencia: 6 },
        { coExperiencia: 7 },
        { coExperiencia: 12 }
      ]
    },
    certificacoes: {
      _deleteGroup: true,
      items: [
        { coCertificacao: 3 }
      ]
    },
    projetos: {
      _deleteGroup: true,
      items: [
        { coProjeto: 9 },
        { coProjeto: 8 }
      ]
    }
  };
  
  
  