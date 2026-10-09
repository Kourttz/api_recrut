import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarUnidadeDto {
  @IsString()
  noUnidade: string;

  @IsBoolean()
  icSituacaoAtivo: boolean;
}

export class AtualizarUnidadeDto {
    @IsNumber()
    @Min(1)
    coUnidade: number;
  
    @IsString()
    noUnidade: string;
  
    @IsBoolean()
    icSituacaoAtivo: boolean;
}

export class DeletarUnidadeDto {
    @IsNumber()
    @Min(1)
    coUnidade: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coUnidade: number;
}
