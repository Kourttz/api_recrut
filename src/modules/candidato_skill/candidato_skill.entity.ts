import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidatos } from '../candidatos/candidatos.entity'; 
import { Skill } from '../skill/skill.entity';
  
@Entity({ name: 'tb_candidato_skill' })
export class CandidatoSkill {
  
  @PrimaryGeneratedColumn({ name: 'co_candidato_skill' })
  coCandidatoSkill: number;

  // Chaves Estrangeiras (colunas)
  @Column({ name: 'co_candidato', nullable: false })
  coCandidato: number;

  @Column({ name: 'co_skill', nullable: false })
  coSkill: number;

  @Column({ name: 'nu_nivel', type: 'integer',  nullable: true })
  nuNivel: number;
  
  // --- Relacionamento com Candidato ---
  @ManyToOne(() => Candidatos, (candidato) => candidato.candidatoSkills)
  @JoinColumn({ name: 'co_candidato' })
  candidato: Candidatos;

  // --- Relacionamento com Skill ---
  @ManyToOne(() => Skill, (skill) => skill.candidatoSkills, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'co_skill' })
  skill: Skill;
}