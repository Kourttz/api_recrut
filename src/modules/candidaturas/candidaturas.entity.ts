import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Vagas } from '../vagas/vagas.entity'; 
import { FuncaoCandidatura } from '../funcao_candidatura/funcao_candidatura.entity';
import { Status } from '../status/status.entity'; 
import { StatusAgendado } from '../status_agendado/status_agendado.entity';
import { HistoricoCandidatura } from '../historico_candidatura/historico_candidatura.entity';
import { Usuarios } from '../usuarios/usuarios.entity';

@Entity({ name: 'tb_candidaturas' })
export class Candidaturas {
  @PrimaryGeneratedColumn({
    name: 'co_candidatura',
    type: 'int',
  })
  coCandidatura: number;

  // =====================================================
  // VAGA
  // =====================================================
  @Column({ name: 'co_vaga', type: 'int', nullable: false })
  coVaga: number;

  @ManyToOne(() => Vagas)
  @JoinColumn({ name: 'co_vaga' })
  vaga: Vagas;

  // =====================================================
  // FUNÇÃO / CANDIDATO
  // =====================================================
  @Column({ name: 'co_funcao_candidatura', type: 'int', nullable: false })
  coFuncaoCandidatura: number;

  @ManyToOne(() => FuncaoCandidatura)
  @JoinColumn({ name: 'co_funcao_candidatura' })
  funcaoCandidatura: FuncaoCandidatura;

  // =====================================================
  // STATUS
  // =====================================================
  @Column({ name: 'co_status', type: 'int', nullable: false })
  coStatus: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'co_status' })
  status: Status;

  // =====================================================
  // METADADOS
  // =====================================================
  @CreateDateColumn({
    name: 'dt_criado_em',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dtCriadoEm: Date;

  // =====================================================
  // STATUS AGENDADO (29)
  // =====================================================
  @OneToOne(
    () => StatusAgendado,
    statusAgendado => statusAgendado.candidatura,
    {
      cascade: false, // controle TOTAL no service
    },
  )
  statusAgendado?: StatusAgendado;
  
  // =====================================================
  // HISTÓRICO DE CANDIDATURAS
  // =====================================================
  @OneToMany(() => HistoricoCandidatura, (historico) => historico.candidatura)
  historicos: HistoricoCandidatura[];

  // =====================================================
  // Usuário atribuido (coUsuario) - para controle de ações de atualização de status
  // =====================================================
  @ManyToOne(() => Usuarios, usuario => usuario.candidaturas, {
    nullable: true,
  })
  @JoinColumn({ name: 'co_usuario_atribuido' })
  usuarioAtribuido: Usuarios;
  
  @Column({ name: 'co_usuario_atribuido', nullable: true })
  coUsuarioAtribuido: number | null;
  

}
