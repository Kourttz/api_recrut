import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity';

@Entity({ name: 'tb_educacao' })
export class Educacao {
  @PrimaryGeneratedColumn({ name: 'co_educacao' })
  coEducacao: number;

  @ManyToOne(() => Candidatos, (candidato) => candidato.educacoes)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  @Column({ name: 'co_candidato', type: 'int', nullable: false })
  coCandidato: number;
  
  @Column({ name: 'no_instituicao', type: 'varchar', length: 200, nullable: true }) 
  noInstituicao: string;

  @Column({ name: 'no_curso', type: 'varchar', length: 200, nullable: true })
  noCurso: string;

  @Column({ name: 'no_nivel', type: 'varchar', length: 100, nullable: true })
  noNivel: string;

  @Column({ name: 'dt_inicio', type: 'date', nullable: true }) 
  dtInicio: Date;

  @Column({ name: 'dt_fim', type: 'date', nullable: true })
  dtFim: Date | null;

  @Column({ name: 'de_descricao', type: 'text', nullable: true })
  deDescricao: string;

  @Column({ name: 'no_status', type: 'varchar', length: 50, nullable: true })
  noStatus: string;
}