import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FuncaoCandidatura } from '../funcao_candidatura/funcao_candidatura.entity';

@Entity({ name: 'tb_funcoes' })
export class Funcoes {
  @PrimaryGeneratedColumn({ 
    name: 'co_funcao',
    type: 'int' 
  })
  coFuncao: number;

  @Column({ 
    name: 'no_funcao',
    type: 'varchar', 
    length: 255 
  })
  noFuncao: string;

  @Column({ 
    name: 'ic_situacao_ativo', 
    type: 'boolean',
    default: true 
  })
  icSituacaoAtivo: boolean;


  @OneToMany(
    () => FuncaoCandidatura,
    (fc) => fc.funcao
  )
  funcoesCandidatura: FuncaoCandidatura[];
  

}