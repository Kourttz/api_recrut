import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CandidatoSkill } from '../candidato_skill/candidato_skill.entity';

@Entity({ name: 'tb_skill' })
export class Skill {
  @PrimaryGeneratedColumn({ name: 'co_skill' })
  coSkill: number;

  @Column({ name: 'no_skill', type: 'varchar', length: 100, unique: true, nullable: false })
  noSkill: string;

  // Um Skill pode estar em muitas entradas de CandidatoSkill
  @OneToMany(() => CandidatoSkill, (candidatoSkill) => candidatoSkill.skill)
  candidatoSkills: CandidatoSkill[];
}