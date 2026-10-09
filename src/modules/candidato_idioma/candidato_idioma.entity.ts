import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity';
import { Idioma } from '../idioma/idioma.entity';

@Entity({ name: 'tb_candidato_idioma' })
export class CandidatoIdioma {

  @PrimaryGeneratedColumn({ name: 'co_candidato_idioma' })
  coCandidatoIdioma: number;

  @Column({ name: 'no_nivel', type: 'varchar', nullable: true })
  noNivel: string;

  // FK → Candidato
  @ManyToOne(() => Candidatos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  // FK → Idioma
  @ManyToOne(() => Idioma, {
    nullable: false,
  })
  @JoinColumn({ name: 'co_idioma' })
  idioma: Idioma;
}
