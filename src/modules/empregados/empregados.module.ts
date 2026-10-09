import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empregado } from './entities/empregado.entity';
import { EmpregadosService } from './empregados.service';
import { EmpregadosController } from './empregados.controller';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Empregado]), AuthModule],
  controllers: [EmpregadosController],
  providers: [EmpregadosService],
  exports: [EmpregadosService, TypeOrmModule],
})
export class EmpregadosModule {}
