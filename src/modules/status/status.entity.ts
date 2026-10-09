import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'tb_status' })
export class Status {
  @PrimaryGeneratedColumn({ 
    name: 'co_status',
    type: 'int' 
  })
  coStatus: number;

  @Column({ 
    name: 'no_status',
    type: 'varchar', 
    length: 255,
    nullable: false 
  })
  noStatus: string;

  @Column({ 
    name: 'ic_situacao_ativo', 
    type: 'boolean',
    default: true 
  })
  icSituacaoAtivo: boolean;

}