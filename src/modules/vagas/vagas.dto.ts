import {
    IsString,
    IsBoolean,
    IsOptional,
    IsInt,
    IsNotEmpty,
    IsNumber,
    Min,
    IsDateString,
    ValidateIf,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  // DTO para Criação (POST)
  // Todos os campos marcados como necessários (exceto os de auditoria) estão aqui.
  export class CriarVagaDto {
    // --- Campos Principais ---
    @ApiProperty({ description: 'Título ou nome principal da vaga', example: 'Desenvolvedor Backend Sênior' })
    @IsString()
    @IsNotEmpty()
    noVaga: string;
  
    @ApiProperty({ description: 'Descrição detalhada da vaga (pode ser um texto longo)', example: 'Responsável por desenvolver e manter APIs...' })
    @IsString()
    @IsNotEmpty()
    deVaga: string;
  
    // --- Relacionamentos (IDs) ---
    @ApiProperty({ description: 'ID da Unidade à qual a vaga pertence', example: 1 })
    @IsInt()
    @Min(1)
    coUnidade: number;
  
    @ApiProperty({ description: 'ID da Função (Cargo) associada à vaga', example: 5 })
    @IsInt()
    @Min(1)
    coFuncao: number;
  
    // --- Localização e Execução ---
    @ApiProperty({ description: 'Cidade onde o trabalho será executado', example: 'Curitiba' })
    @IsString()
    @IsNotEmpty()
    noCidadeExecucao: string;
  
    @ApiProperty({ description: 'Área de atuação (Ex: Tecnologia, Financeiro, Marketing)', example: 'Tecnologia' })
    @IsString()
    @IsNotEmpty()
    noAreaAtuacao: string;
  
    @ApiProperty({ description: 'Cidade base da vaga (Pode ser diferente da execução)', example: 'São Paulo' })
    @IsString()
    @IsNotEmpty()
    noCidade: string;
  
    @ApiProperty({ description: 'Estado base da vaga', example: 'PR' })
    @IsString()
    @IsNotEmpty()
    noEstado: string;
  
    // --- Remuneração e Benefícios ---
    @ApiProperty({ description: 'Salário mínimo da faixa (use ponto para decimal)', example: 5000.00 })
    @IsNumber()
    @IsNotEmpty()
    vlSalarioMin: number;
  
    @ApiProperty({ description: 'Salário máximo da faixa (use ponto para decimal)', example: 8000.00 })
    @IsNumber()
    @IsNotEmpty()
    vlSalarioMax: number;
  
    @ApiProperty({ description: 'Tipo de remuneração (Ex: CLT, PJ, Estágio)', example: 'CLT' })
    @IsString()
    @IsNotEmpty()
    tpRemuneracao: string;
  
    @ApiProperty({ description: 'Descrição dos benefícios oferecidos (Ex: VR, plano de saúde)', example: 'Vale Refeição, Plano de Saúde, Gympass' })
    @IsString()
    @IsNotEmpty()
    deBeneficios: string;
  
    // --- Formato e Regime ---
    @ApiProperty({ description: 'Formato de trabalho (Ex: Remoto, Híbrido, Presencial)', example: 'Híbrido' })
    @IsString()
    @IsNotEmpty()
    tpFormatoTrabalho: string;
  
    @ApiProperty({ description: 'Regime de contratação (Ex: Integral, Parcial)', example: 'Integral' })
    @IsString()
    @IsNotEmpty()
    tpRegimeContratacao: string;
  
    @ApiProperty({ description: 'Nível da vaga (Ex: Júnior, Pleno, Sênior, Coordenador)', example: 'Sênior' })
    @IsString()
    @IsNotEmpty()
    noNivel: string;
    
    // --- Datas e Tipos ---
    @ApiProperty({ description: 'Data de abertura da vaga (formato YYYY-MM-DD)', example: '2025-12-12' })
    @IsDateString()
    @IsNotEmpty()
    dtAbertura: string;
  
    @ApiProperty({ description: 'Data de encerramento da vaga (formato YYYY-MM-DD)', example: '2026-01-31' })
    @IsDateString()
    @IsNotEmpty()
    dtEncerramento: string;
    
    @ApiProperty({ description: 'Tipo de vaga (Ex: Efetiva, Temporária)', example: 'Efetiva' })
    @IsString()
    @IsNotEmpty()
    tpVaga: string;
    
    @ApiProperty({ description: 'Status atual da vaga (Ex: Em Aberto, Pausada, Cancelada)', example: 'Em Aberto' })
    @IsString()
    @IsNotEmpty()
    noStatus: string;

    @ApiPropertyOptional({ description: 'ID do recrutador responsavel pela criação da vaga', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    coUsuarioCadastro: number;
  
    // --- Campos Opcionais ---
    @ApiPropertyOptional({ description: 'Nome do Projeto associado à vaga (opcional)', example: 'Projeto Alpha' })
    @IsString()
    @IsOptional()
    noProjeto?: string;
  
    @ApiPropertyOptional({ description: 'Situação ativa/inativa da vaga', default: true })
    @IsBoolean()
    @IsOptional()
    icSituacaoAtivo?: boolean;

  }
  
  // DTO para Atualização Parcial (PATCH)
  // Todos os campos são opcionais, mas se fornecidos, devem ser validados.
  export class AtualizarVagaDto {
    // --- Campos Principais ---
    @ApiPropertyOptional({ description: 'Título ou nome principal da vaga', example: 'Desenvolvedor Backend Pleno' })
    @IsString()
    @IsOptional()
    noVaga?: string;
  
    @ApiPropertyOptional({ description: 'Descrição detalhada da vaga (pode ser um texto longo)' })
    @IsString()
    @IsOptional()
    deVaga?: string;
  
    // --- Relacionamentos (IDs) ---
    @ApiPropertyOptional({ description: 'ID da Unidade à qual a vaga pertence', example: 2 })
    @IsInt()
    @Min(1)
    @IsOptional()
    coUnidade?: number;
  
    @ApiPropertyOptional({ description: 'ID da Função (Cargo) associada à vaga', example: 6 })
    @IsInt()
    @Min(1)
    @IsOptional()
    coFuncao?: number;
  
    // --- Localização e Execução ---
    @ApiPropertyOptional({ description: 'Cidade onde o trabalho será executado', example: 'Florianópolis' })
    @IsString()
    @IsOptional()
    noCidadeExecucao?: string;
  
    @ApiPropertyOptional({ description: 'Área de atuação (Ex: Tecnologia, Financeiro, Marketing)' })
    @IsString()
    @IsOptional()
    noAreaAtuacao?: string;
  
    @ApiPropertyOptional({ description: 'Cidade base da vaga' })
    @IsString()
    @IsOptional()
    noCidade?: string;
  
    @ApiPropertyOptional({ description: 'Estado base da vaga' })
    @IsString()
    @IsOptional()
    noEstado?: string;
  
    // --- Remuneração e Benefícios ---
    // Usamos ValidateIf para garantir que, se o campo for enviado, ele seja um número.
    @ApiPropertyOptional({ description: 'Salário mínimo da faixa', example: 6000.00 })
    @IsNumber()
    @IsOptional()
    vlSalarioMin?: number;
  
    @ApiPropertyOptional({ description: 'Salário máximo da faixa', example: 9000.00 })
    @IsNumber()
    @IsOptional()
    vlSalarioMax?: number;
  
    @ApiPropertyOptional({ description: 'Tipo de remuneração (Ex: CLT, PJ, Estágio)' })
    @IsString()
    @IsOptional()
    tpRemuneracao?: string;
  
    @ApiPropertyOptional({ description: 'Descrição dos benefícios oferecidos' })
    @IsString()
    @IsOptional()
    deBeneficios?: string;
  
    // --- Formato e Regime ---
    @ApiPropertyOptional({ description: 'Formato de trabalho (Ex: Remoto, Híbrido, Presencial)' })
    @IsString()
    @IsOptional()
    tpFormatoTrabalho?: string;
  
    @ApiPropertyOptional({ description: 'Regime de contratação (Ex: Integral, Parcial)' })
    @IsString()
    @IsOptional()
    tpRegimeContratacao?: string;
  
    @ApiPropertyOptional({ description: 'Nível da vaga (Ex: Júnior, Pleno, Sênior, Coordenador)' })
    @IsString()
    @IsOptional()
    noNivel?: string;
    
    // --- Datas e Tipos ---
    @ApiPropertyOptional({ description: 'Data de abertura da vaga (formato YYYY-MM-DD)', example: '2026-01-01' })
    @IsDateString()
    @IsOptional()
    dtAbertura?: string;
  
    @ApiPropertyOptional({ description: 'Data de encerramento da vaga (formato YYYY-MM-DD)', example: '2026-02-28' })
    @IsDateString()
    @IsOptional()
    dtEncerramento?: string;
    
    @ApiPropertyOptional({ description: 'Tipo de vaga (Ex: Efetiva, Temporária)' })
    @IsString()
    @IsOptional()
    tpVaga?: string;
    
    @ApiPropertyOptional({ description: 'Status atual da vaga (Ex: Em Aberto, Pausada, Cancelada)', example: 'Pausada' })
    @IsString()
    @IsOptional()
    noStatus?: string;

    @ApiPropertyOptional({ description: 'ID do recrutador responsavel pela edição da vaga', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    coUsuarioAtualizacao: number;
  
    // --- Campo Opcional ---
    @ApiPropertyOptional({ description: 'Nome do Projeto associado à vaga (opcional)' })
    @IsString()
    @IsOptional()
    noProjeto?: string;
    
  }