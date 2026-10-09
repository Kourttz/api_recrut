import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoCandidaturaService } from './historico_candidatura.service';
import { HistoricoCandidaturaController } from './historico_candidatura.controller';
import { HistoricoCandidatura } from './historico_candidatura.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricoCandidatura]), AuthModule],
  controllers: [HistoricoCandidaturaController],
  providers: [HistoricoCandidaturaService], 
  exports: [HistoricoCandidaturaService]
})
export class HistoricoCandidaturaModule {}
