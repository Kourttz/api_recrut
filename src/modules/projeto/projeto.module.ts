import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoService } from './projeto.service';
import { Projeto } from './projeto.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Projeto]), AuthModule],
  providers: [ProjetoService],
  exports: [ProjetoService]
})
export class ProjetoModule {}
