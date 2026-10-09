import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarFuncaoDto {
  @IsString()
  noFuncao: string;

  @IsBoolean()
  icSituacaoAtivo: boolean;
}

export class AtualizarFuncaoDto {
    @IsNumber()
    @Min(1)
    coFuncao: number;
  
    @IsString()
    noFuncao: string;
  
    @IsBoolean()
    icSituacaoAtivo: boolean;
}

export class DeletarFuncaoDto {
    @IsNumber()
    @Min(1)
    coFuncao: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coFuncao: number;
}
