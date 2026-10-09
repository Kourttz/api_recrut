import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidaturasService } from './candidaturas.service';
import { CandidaturasCronService } from './candidaturas_cron.service';
import { CandidaturasController } from './candidaturas.controller';
import { Candidaturas } from './candidaturas.entity';
import { FuncaoCandidatura } from '../funcao_candidatura/funcao_candidatura.entity';
import { StatusAgendado } from '../status_agendado/status_agendado.entity';
import { Vagas } from '../vagas/vagas.entity'; 
import { Status } from '../status/status.entity'; 
import { Candidatos } from '../candidatos/candidatos.entity'; 
import { Funcoes } from '../funcoes/funcoes.entity'; 
import { Idioma } from '../idioma/idioma.entity';
import { HistoricoCandidatura } from '../historico_candidatura/historico_candidatura.entity';
import { AuthModule } from '../../common/auth/auth.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidaturas, 
      FuncaoCandidatura, 
      StatusAgendado,
      Vagas, 
      Status,
      Candidatos,
      Funcoes,
      Idioma,
      HistoricoCandidatura
    ]),
    forwardRef(() => KafkaModule),
    AuthModule,
  ],
  controllers: [CandidaturasController],
  providers: [
    CandidaturasService,
    CandidaturasCronService
  ],
  exports: [CandidaturasService, CandidaturasCronService, TypeOrmModule.forFeature([Candidaturas, FuncaoCandidatura, StatusAgendado])],
})
export class CandidaturasModule {}