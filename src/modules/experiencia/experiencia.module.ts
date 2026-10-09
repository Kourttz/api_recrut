import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienciaService } from './experiencia.service';
import { Experiencia } from './experiencia.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experiencia]) , AuthModule],
  providers: [ExperienciaService],
  exports: [ExperienciaService]
})
export class ExperienciaModule {}
