import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatoIdiomaService } from './candidato_idioma.service';
import { CandidatoIdioma } from './candidato_idioma.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CandidatoIdioma]), AuthModule],
  providers: [CandidatoIdiomaService],
  exports: [CandidatoIdiomaService]
})
export class CandidatoIdiomaModule {}
