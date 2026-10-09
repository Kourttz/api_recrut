import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Unidades } from '../unidades/unidades.entity'; 
import { Funcoes } from '../funcoes/funcoes.entity';   
import { Usuarios } from '../usuarios/usuarios.entity';

@Entity({ name: 'tb_vagas' })
export class Vagas {
  @PrimaryGeneratedColumn({ 
    name: 'co_vaga',
    type: 'int' 
  })
  coVaga: number;

  @Column({ 
    name: 'no_vaga',
    type: 'varchar', 
    length: 255,
    nullable: false 
  })
  noVaga: string;

  @Column({ 
    name: 'de_vaga',
    type: 'text',
    nullable: true 
  })
  deVaga: string;

  // --- Relacionamento: Unidade ---
  @Column({ name: 'co_unidade', type: 'int', nullable: false })
  coUnidade: number;

  @ManyToOne(() => Unidades)
  @JoinColumn({ name: 'co_unidade' })
  unidade: Unidades;

  // --- Relacionamento: Função ---
  @Column({ name: 'co_funcao', type: 'int', nullable: false })
  coFuncao: number;

  @ManyToOne(() => Funcoes)
  @JoinColumn({ name: 'co_funcao' })
  funcao: Funcoes;

  @Column({ 
    name: 'ic_situacao_ativo', 
    type: 'boolean',
    default: true,
    nullable: true
  })
  icSituacaoAtivo: boolean;

  @Column({ 
    name: 'no_cidade_execucao', 
    type: 'varchar', 
    length: 150,
    nullable: true 
  })
  noCidadeExecucao: string;

  @Column({ 
    name: 'no_area_atuacao', 
    type: 'varchar', 
    length: 150,
    nullable: true 
  })
  noAreaAtuacao: string;

  @Column({ 
    name: 'vl_salario_min', 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    nullable: true 
  })
  vlSalarioMin: number;

  @Column({ 
    name: 'vl_salario_max', 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    nullable: true 
  })
  vlSalarioMax: number;

  @Column({ 
    name: 'tp_remuneracao', 
    type: 'varchar', 
    length: 50,
    nullable: true 
  })
  tpRemuneracao: string;

  @Column({ 
    name: 'de_beneficios', 
    type: 'text',
    nullable: true 
  })
  deBeneficios: string;

  @Column({ 
    name: 'no_cidade', 
    type: 'varchar', 
    length: 100,
    nullable: true 
  })
  noCidade: string;

  @Column({ 
    name: 'no_estado', 
    type: 'varchar', 
    length: 50,
    nullable: true 
  })
  noEstado: string;

  @Column({ 
    name: 'tp_formato_trabalho', 
    type: 'varchar', 
    length: 30,
    nullable: true 
  })
  tpFormatoTrabalho: string;

  @Column({ 
    name: 'tp_regime_contratacao', 
    type: 'varchar', 
    length: 30,
    nullable: true 
  })
  tpRegimeContratacao: string;

  @Column({ 
    name: 'no_nivel', 
    type: 'varchar', 
    length: 30,
    nullable: true 
  })
  noNivel: string;

  @Column({ 
    name: 'no_projeto', 
    type: 'varchar', 
    length: 200,
    nullable: true 
  })
  noProjeto: string;

  @Column({ 
    name: 'dt_abertura', 
    type: 'date',
    nullable: true 
  })
  dtAbertura: Date;

  @Column({ 
    name: 'dt_encerramento', 
    type: 'date',
    nullable: true 
  })
  dtEncerramento: Date;

  @Column({ 
    name: 'tp_vaga', 
    type: 'varchar', 
    length: 30,
    nullable: true 
  })
  tpVaga: string;

  @Column({ 
    name: 'no_status', 
    type: 'varchar', 
    length: 20,
    nullable: true 
  })
  noStatus: string;

  // --- Relacionamento: Usuário Cadastro ---
  @Column({ name: 'co_usuario_cadastro', type: 'int', nullable: true })
  coUsuarioCadastro: number;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'co_usuario_cadastro' })
  usuarioCadastro: Usuarios;

  // --- Timestamp: Criado Em ---
  @CreateDateColumn({ 
    name: 'dt_criado_em', 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  dtCriadoEm: Date;

  // --- Relacionamento: Usuário Atualização ---
  @Column({ name: 'co_usuario_atualizacao', type: 'int', nullable: true })
  coUsuarioAtualizacao: number;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'co_usuario_atualizacao' })
  usuarioAtualizacao: Usuarios;

  // --- Timestamp: Atualizado Em ---
  @UpdateDateColumn({ 
    name: 'dt_atualizado_em', 
    type: 'timestamp', 
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  dtAtualizadoEm: Date;
}