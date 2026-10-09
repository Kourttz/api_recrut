import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity';

@Entity({ name: 'tb_certificacao' })
export class Certificacao {
  @PrimaryGeneratedColumn({ name: 'co_certificacao' })
  coCertificacao: number;

  // --- RELACIONAMENTO MANY-TO-ONE ---
  @ManyToOne(() => Candidatos, (candidato) => candidato.certificacoes)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  @Column({ name: 'co_candidato', type: 'int', nullable: false })
  coCandidato: number;

  // --- DEMAIS COLUNAS ---
  @Column({ name: 'no_certificacao', type: 'varchar', length: 200, nullable: true })
  noCertificacao: string;

  @Column({ name: 'no_instituicao', type: 'varchar', length: 200, nullable: true })
  noInstituicao: string;

  @Column({ name: 'url_certificado', type: 'varchar', length: 300, nullable: true })
  urlCertificado: string;

  @Column({ name: 'dt_emissao', type: 'date', nullable: true })
  dtEmissao: Date;

  @Column({ name: 'dt_validade', type: 'date', nullable: true })
  dtValidade: Date | null;
}