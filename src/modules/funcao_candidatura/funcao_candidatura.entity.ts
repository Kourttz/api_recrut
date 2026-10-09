import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Funcoes } from '../funcoes/funcoes.entity';     
import { Candidatos } from '../candidatos/candidatos.entity'; 

@Entity({ name: 'tb_funcao_candidatura' })
export class FuncaoCandidatura {
  @PrimaryGeneratedColumn({ 
    name: 'co_funcao_candidatura',
    type: 'int' 
  })
  coFuncaoCandidatura: number;

  @Column({ name: 'co_funcao', type: 'int', nullable: false })
  coFuncao: number;

  @ManyToOne(() => Funcoes, (funcao) => funcao.funcoesCandidatura)
  @JoinColumn({ name: 'co_funcao' })
  funcao: Funcoes;


  @Column({ name: 'co_candidato', type: 'int', nullable: false })
  coCandidato: number;

  @ManyToOne(() => Candidatos, candidato => candidato.funcoesCandidatura)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

}