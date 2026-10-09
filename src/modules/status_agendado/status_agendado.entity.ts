import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Candidaturas } from '../candidaturas/candidaturas.entity'; 

@Entity({ name: 'tb_status_agendado' })
export class StatusAgendado {
  @PrimaryGeneratedColumn({ name: 'co_status_agendado' })
  coStatusAgendado: number;

  @Column({ name: 'co_candidatura', type: 'int', unique: true })
  coCandidatura: number;

  @OneToOne(() => Candidaturas, candidatura => candidatura.statusAgendado, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'co_candidatura' })
  candidatura: Candidaturas;

  @Column({ name: 'dt_status', type: 'timestamp', nullable: false })
  dtStatus: Date;
}
