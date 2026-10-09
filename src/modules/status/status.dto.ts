import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarStatusDto {
  @IsString()
  noStatus: string;

  @IsBoolean()
  icSituacaoAtivo: boolean;
}

export class AtualizarStatusDto {
    @IsNumber()
    @Min(1)
    coStatus: number;
  
    @IsString()
    noStatus: string;
  
    @IsBoolean()
    icSituacaoAtivo: boolean;
}

export class DeletarStatusDto {
    @IsNumber()
    @Min(1)
    coStatus: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coStatus: number;
}
