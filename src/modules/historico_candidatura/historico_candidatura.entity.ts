import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    ManyToOne, 
    JoinColumn 
  } from 'typeorm';
  import { Usuarios } from '../usuarios/usuarios.entity'; 
  import { Candidaturas } from '../candidaturas/candidaturas.entity'; 
  
  @Entity('tb_historico_candidatura')
  export class HistoricoCandidatura {
    @PrimaryGeneratedColumn({ name: 'co_historico_candidatura' })
    coHistoricoCandidatura: number;
  
    @Column({ name: 'co_usuario' })
    coUsuario: number;
  
    @Column({ name: 'co_candidatura' })
    coCandidatura: number;
  
    @Column({ name: 'no_historico', length: 500 })
    noHistorico: string;
  
    @CreateDateColumn({ name: 'dt_registro' })
    dtRegistro: Date;
  
    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: 'co_usuario' })
    usuario: Usuarios;
  
    @ManyToOne(() => Candidaturas)
    @JoinColumn({ name: 'co_candidatura' })
    candidatura: Candidaturas;
  }