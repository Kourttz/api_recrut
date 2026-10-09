import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarIdiomaDto {
  @IsString()
  noIdioma: string;
  
}

export class AtualizarIdiomaDto {
    @IsNumber()
    @Min(1)
    coIdioma: number;
  
    @IsString()
    noIdioma: string;
}

export class DeletarIdiomaDto {
    @IsNumber()
    @Min(1)
    coIdioma: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coIdioma: number;
}
