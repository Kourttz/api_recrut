import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducacaoService } from './educacao.service';
import { Educacao } from './educacao.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Educacao]), AuthModule],
  providers: [EducacaoService],
  exports: [EducacaoService],
})
export class EducacaoModule {}
