import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CandidatoIdioma } from '../candidato_idioma/candidato_idioma.entity';

@Entity({ name: 'tb_idioma' })
export class Idioma {
  @PrimaryGeneratedColumn({ name: 'co_idioma' })
  coIdioma: number;

  @Column({ name: 'no_idioma', type: 'varchar', length: 100, unique: true, nullable: false })
  noIdioma: string;

  // Um Idioma pode estar em muitas entradas de CandidatoIdioma
  @OneToMany(() => CandidatoIdioma, (candidatoIdioma) => candidatoIdioma.idioma)
  candidatoIdiomas: CandidatoIdioma[];
}