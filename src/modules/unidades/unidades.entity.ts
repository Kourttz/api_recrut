import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("gestao.tb_unidades")
export class Unidades {

  @PrimaryGeneratedColumn({ name: "co_unidade" })
  coUnidade: number;

  @Column({ name: "nu_filial" })
  nuFilial: number;

  @Column({ name: "no_projeto" })
  noProjeto: string;

  @Column({ name: "nu_contrato" })
  nuContrato: string;

  @Column({ name: "dt_inicio", type: "date" })
  dtInicio: Date;

  @Column({ name: "dt_fim", type: "date", nullable: true })
  dtFim?: Date;

  @Column({ name: "nu_cnpj" })
  nuCnpj: string;

  @Column({ name: "no_razao_social" })
  noRazaoSocial: string;

  @Column({ name: "no_endereco" })
  noEndereco: string;

  @Column({ name: "no_municipio" })
  noMunicipio: string;

  @Column({ name: "no_unidade_federativa" })
  noUnidadeFederativa: string;

  @Column({ name: "co_usuario_gerente" })
  coUsuarioGerente: number;

  @Column({ name: "ic_situacao_ativo", default: true })
  icSituacaoAtivo: boolean;
}
