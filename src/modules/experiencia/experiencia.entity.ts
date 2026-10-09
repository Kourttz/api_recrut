import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity';

@Entity({ name: 'tb_experiencia' })
export class Experiencia {
  @PrimaryGeneratedColumn({ name: 'co_experiencia' })
  coExperiencia: number;

  @ManyToOne(() => Candidatos, (candidato) => candidato.experiencias)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  @Column({ name: 'co_candidato', type: 'int', nullable: false })
  coCandidato: number;
  
  @Column({ name: 'no_cargo', type: 'varchar', length: 200, nullable: true }) 
  noCargo: string;

  @Column({ name: 'no_empresa', type: 'varchar', length: 200, nullable: true }) 
  noEmpresa: string;

  @Column({ name: 'tp_emprego', type: 'varchar', length: 50, nullable: true })
  tpEmprego: string;

  @Column({ name: 'no_localizacao', type: 'varchar', length: 200, nullable: true })
  noLocalizacao: string;

  @Column({ name: 'ic_atual', type: 'boolean', default: false, nullable: true }) 
  icAtual: boolean;

  @Column({ name: 'dt_inicio', type: 'date', nullable: true })
  dtInicio: Date;

  @Column({ name: 'dt_fim', type: 'date', nullable: true })
  dtFim: Date | null;

  @Column({ name: 'de_descricao', type: 'text', nullable: true })
  deDescricao: string;
}