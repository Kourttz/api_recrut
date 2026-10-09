import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity';

@Entity({ name: 'tb_link' })
export class Link {
  @PrimaryGeneratedColumn({ name: 'co_link' })
  coLink: number;

  // --- RELACIONAMENTO MANY-TO-ONE ---
  @ManyToOne(() => Candidatos, (candidato) => candidato.links)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  @Column({ name: 'co_candidato', type: 'int' })
  coCandidato: number;
  
  // --- DEMAIS COLUNAS ---
  @Column({ name: 'no_titulo', type: 'varchar', length: 200 })
  noTitulo: string;

  @Column({ name: 'url_link', type: 'varchar', length: 300 })
  urlLink: string;
}