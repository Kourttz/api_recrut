import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity';

@Entity({ name: 'tb_projeto' })
export class Projeto {
  @PrimaryGeneratedColumn({ name: 'co_projeto' })
  coProjeto: number;

  // --- RELACIONAMENTO MANY-TO-ONE ---
  @ManyToOne(() => Candidatos, (candidato) => candidato.projetos)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  @Column({ name: 'co_candidato', type: 'int' })
  coCandidato: number;
  
  // --- DEMAIS COLUNAS ---
  @Column({ name: 'no_projeto', type: 'varchar', length: 200, nullable: false })
  noProjeto: string;

  @Column({ name: 'de_descricao', type: 'text', nullable: true })
  deDescricao: string;

  @Column({ name: 'url_projeto', type: 'varchar', length: 300, nullable: true })
  urlProjeto: string;

  @Column({ name: 'dt_inicio', type: 'date' })
  dtInicio: Date;

  @Column({ name: 'dt_fim', type: 'date', nullable: true })
  dtFim: Date | null;
}