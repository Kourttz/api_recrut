import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificacaoService } from './certificacao.service';
import { Certificacao } from './certificacao.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Certificacao]), AuthModule],
  providers: [CertificacaoService],
  exports: [CertificacaoService]
})
export class CertificacaoModule {}
