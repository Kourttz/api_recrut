import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({ name: 'tb_empregados', schema: 'sc_bases' })
export class Empregado {

  @PrimaryGeneratedColumn({ name: 'id_empregado' })
  id_empregado: number;

  @Column({ name: 'co_matricula' })
  co_matricula: string;

  @Column({ name: 'co_matricula_cliente', nullable: true })
  co_matricula_cliente?: string;

  @Column({ name: 'no_nome', length: 60, nullable: true })
  no_nome?: string;

  @Column({ name: 'co_cpf', length: 20, nullable: true })
  co_cpf?: string;

  @Column({ name: 'co_funcao', nullable: true })
  co_funcao?: string;

  @Column({ name: 'co_matricula_gestor_cliente', nullable: true })
  co_matricula_gestor_cliente?: string;

  @Column({ name: 'co_matricula_gestor_plansul', nullable: true })
  co_matricula_gestor_plansul?: string;

  @Column({ name: 'co_matricula_monitor_plansul', nullable: true })
  co_matricula_monitor_plansul?: string;

  @Column({ name: 'co_matricula_alteracao_plansul', nullable: true })
  co_matricula_alteracao_plansul?: string;

  @Column({ name: 'nu_telefone', nullable: true })
  nu_telefone?: string;

  @Column({ name: 'nu_telefone2', nullable: true })
  nu_telefone2?: string;

  @Column({ name: 'no_nome_social', nullable: true })
  no_nome_social?: string;

  @Column({ name: 'ds_sexo', length: 1, nullable: true })
  ds_sexo?: string;

  @Column({ name: 'nu_certificado', nullable: true })
  nu_certificado?: string;

  @Column({ name: 'ds_dados_adicionais', nullable: true })
  ds_dados_adicionais?: string;

  @Column({ name: 'nu_pis', type: 'bigint', nullable: true })
  nu_pis?: number;

  @Column({ name: 'nu_filial', nullable: true })
  nu_filial?: number;

  @Column({ name: 'id_situacao', nullable: true })
  id_situacao?: number;

  @Column({ name: 'ds_situacao', nullable: true })
  ds_situacao?: string;

  @Column({ name: 'co_bairro', nullable: true })
  co_bairro?: number;

  @Column({ name: 'co_municipio', nullable: true })
  co_municipio?: number;

  @Column({ name: 'co_local_trabalho', nullable: true })
  co_local_trabalho?: number;

  @Column({ name: 'dt_funcao', type: 'date', nullable: true })
  dt_funcao?: Date;

  @Column({ name: 'dt_nascimento', type: 'date', nullable: true })
  dt_nascimento?: Date;

  @Column({ name: 'dt_admissao', type: 'date', nullable: true })
  dt_admissao?: Date;

  @Column({ name: 'dt_demissao', type: 'date', nullable: true })
  dt_demissao?: Date;

  @Column({ name: 'dt_situacao', type: 'date', nullable: true })
  dt_situacao?: Date;

  @Column({ name: 'dt_hist_alteracao', type: 'date', nullable: true })
  dt_hist_alteracao?: Date;

  @Column({ name: 'dt_alteracao', type: 'timestamp', nullable: true })
  dt_alteracao?: Date;

  @Column({ name: 'hr_jornada_entrada', type: 'time', nullable: true })
  hr_jornada_entrada?: string;

  @Column({ name: 'hr_jornada_saida', type: 'time', nullable: true })
  hr_jornada_saida?: string;

  @Column({ name: 'hr_descanso1', type: 'time', nullable: true })
  hr_descanso1?: string;

  @Column({ name: 'hr_descanso2', type: 'time', nullable: true })
  hr_descanso2?: string;

  @Column({ name: 'hr_lanche', type: 'time', nullable: true })
  hr_lanche?: string;

  @Column({ name: 'ic_certificado_digital', nullable: true })
  ic_certificado_digital?: boolean;
}