import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Experiencia } from '../experiencia/experiencia.entity';
import { Educacao } from '../educacao/educacao.entity';
import { Certificacao } from '../certificacao/certificacao.entity';
import { CandidatoIdioma } from '../candidato_idioma/candidato_idioma.entity';
import { Projeto } from '../projeto/projeto.entity';
import { Link } from '../link/link.entity';
import { CandidatoSkill } from '../candidato_skill/candidato_skill.entity';
import { FuncaoCandidatura } from '../funcao_candidatura/funcao_candidatura.entity';

@Entity({ name: 'tb_candidatos' })
export class Candidatos {
  @PrimaryGeneratedColumn({ name: 'co_candidato', type: 'integer' })
  coCandidato: number;

  @Column({ name: 'no_candidato', type: 'varchar', nullable: false })
  noCandidato: string;

  @Column({ name: 'headline', type: 'varchar', length: 200, nullable: true })
  headline: string;

  @Column({ name: 'resumo', type: 'text', nullable: true })
  resumo: string;

  @Column({ name: 'no_email', type: 'varchar', length: 200, nullable: false })
  noEmail: string;

  @Column({ name: 'nu_telefone', type: 'varchar', length: 50, nullable: false })
  nuTelefone: string;

  @Column({ name: 'dt_nascimento', type: 'date', nullable: false })
  dtNascimento: Date;

  @Column({ name: 'no_localizacao', type: 'varchar', length: 200, nullable: true })
  noLocalizacao: string;

  @Column({ name: 'url_foto', type: 'varchar', length: 300, nullable: true })
  urlFoto: string;

  @Column({ name: 'co_cpf', type: 'varchar', unique: true, nullable: false })
  coCpf: string;

  @Column({ name: 'dt_criado_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dtCriadoEm: Date;

  @Column({ name: 'dt_atualizado_em', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  dtAtualizadoEm: Date;
  
  // --- RELACIONAMENTOS ONE-TO-MANY ---
  
  @OneToMany(() => Experiencia, (experiencia) => experiencia.candidato, { cascade: true })
  experiencias: Experiencia[];

  @OneToMany(() => Educacao, (educacao) => educacao.candidato, { cascade: true })
  educacoes: Educacao[];

  @OneToMany(() => Certificacao, (certificacao) => certificacao.candidato, { cascade: true })
  certificacoes: Certificacao[];

  @OneToMany(
    () => CandidatoIdioma,
    (candidatoIdioma) => candidatoIdioma.candidato,
    {
      cascade: false,    
      eager: false       
    }
  )
  candidatoIdiomas: CandidatoIdioma[];  

  @OneToMany(() => Projeto, (projeto) => projeto.candidato, { cascade: true })
  projetos: Projeto[];

  @OneToMany(() => Link, (link) => link.candidato, { cascade: true })
  links: Link[];

  @OneToMany(
    () => CandidatoSkill,
    (candidatoSkill) => candidatoSkill.candidato,
    {
      cascade: false,
      persistence: false,
      eager: false,
    }
  )
  candidatoSkills: CandidatoSkill[];
  

  @OneToMany(() => FuncaoCandidatura, (fc) => fc.candidato)
    funcoesCandidatura: FuncaoCandidatura[];
}