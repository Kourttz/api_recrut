import { 
    IsString, IsBoolean, IsOptional, IsInt, IsNotEmpty, IsDateString, 
    ValidateIf, IsNumber 
  } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
  
// ID do Status que aciona o registro de agendamento.
const STATUS_AGENDADO_ID = 29;

export class CriarCandidaturaDto {
    // --- Dados para tb_funcao_candidatura ---
    @ApiProperty({ description: 'ID da Função (tb_funcoes)' })
    @IsNotEmpty()
    @IsNumber()
    coFuncao: number; // PK de tb_funcoes
  
    @ApiProperty({ description: 'ID do Candidato (tb_candidatos)' })
    @IsNotEmpty()
    @IsNumber()
    coCandidato: number; // PK de tb_candidatos
  
    // --- Dados para tb_candidaturas ---
    @ApiProperty({ description: 'ID da Vaga (tb_vagas)' })
    @IsNotEmpty()
    @IsNumber()
    coVaga: number; // FK para tb_vagas
  
    @ApiProperty({ 
        description: `ID do Status atual da candidatura (tb_status). Se for ${STATUS_AGENDADO_ID} (Agendado), dtStatus é obrigatório.`, 
        minimum: 1 
    })
    @IsNotEmpty()
    @IsNumber()
    coStatus: number; // FK para tb_status
  
    // --- Dados para tb_status_agendado (Condicional) ---
    @ApiPropertyOptional({ 
        description: 'Data de agendamento do próximo contato/ação. Obrigatório se coStatus for 1.',
        example: '2025-12-29' 
    })
    @ValidateIf(o => o.coStatus === STATUS_AGENDADO_ID)
    @IsNotEmpty({ message: `dtStatus é obrigatório quando coStatus é ${STATUS_AGENDADO_ID} (Agendado).` })
    @IsDateString({}, { message: 'dtStatus deve ser uma string de data válida.' })
    @IsOptional()
    dtStatus?: Date;
}

export class AtualizarResponsavelCandidaturaDto {
  coUsuarioAtribuido?: number | null;
}
  
// DTO para Atualização Parcial (PATCH)
export class AtualizarStatusCandidaturaDto {

  @ApiProperty({
    description: 'Novo status da candidatura (tb_status).',
    example: 3,
  })

  @IsNotEmpty()
  @IsNumber()
  coStatus: number;

  @ApiPropertyOptional({
    description: `Data de agendamento. Obrigatória quando coStatus for ${STATUS_AGENDADO_ID} (Agendado).`,
    example: '2025-12-29',
  })

  @ValidateIf(o => o.coStatus === STATUS_AGENDADO_ID)
  @IsNotEmpty({
    message: `dtStatus é obrigatório quando coStatus é ${STATUS_AGENDADO_ID} (Agendado).`,
  })

  @IsDateString({}, { message: 'dtStatus deve ser uma data válida.' })
  @IsOptional()
  dtStatus?: string;
}
  

// --- MOCKs para Swagger ---

export const MOCK_CRIAR_CANDIDATURA_SIMPLES: CriarCandidaturaDto = {
    coFuncao: 10,
    coCandidato: 1,
    coVaga: 5,
    coStatus: 2, // Exemplo: Em Análise (Não Agendado)
}

export const MOCK_CRIAR_CANDIDATURA_AGENDADA: CriarCandidaturaDto = {
    coFuncao: 10,
    coCandidato: 1,
    coVaga: 5,
    coStatus: STATUS_AGENDADO_ID, 
    // Data de Agendamento é obrigatória neste caso
    dtStatus: '2025-12-29' as any, 
}

// --- MOCKs para Atualização (PATCH) ---


export const MOCK_ATUALIZAR_STATUS_SIMPLES: AtualizarStatusCandidaturaDto = {
  // Exemplo 1: Atualização Simples
  // Mudança de Status para "Entrevista Realizada" (código 3)
  coStatus: 3,
};

export const MOCK_ATUALIZAR_STATUS_AGENDADO: AtualizarStatusCandidaturaDto = {
  // Exemplo 2: Atualização com Agendamento de Retorno (Lógica Condicional)
  // 1. Mudança de Status para STANDBY (código 29)
  coStatus: STATUS_AGENDADO_ID,
   // 2. Data de Agendamento (Obrigatório quando coStatus é 29)
  // O service irá criar/atualizar um registro em tb_status_agendado.
  dtStatus: '2025-12-29',
};