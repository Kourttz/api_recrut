import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncoesController } from './funcoes.controller';
import { FuncoesService } from './funcoes.service';
import { Funcoes } from './funcoes.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Funcoes]), AuthModule],
  controllers: [FuncoesController],
  providers: [FuncoesService],
})
export class FuncoesModule {}
