import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatosService } from './candidatos.service';
import { CandidatosController } from './candidatos.controller';
import { Candidatos } from './candidatos.entity';
import { CandidatoSkill } from '../candidato_skill/candidato_skill.entity';
import { CandidatoIdioma } from '../candidato_idioma/candidato_idioma.entity'; 
import { SkillModule } from '../skill/skill.module';
import { Idioma } from '../idioma/idioma.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidatos,
      CandidatoSkill,
      CandidatoIdioma, 
      Idioma,
    ]),
    SkillModule,
    AuthModule,
  ],
  controllers: [CandidatosController],
  providers: [CandidatosService],
  exports: [
    CandidatosService,
    TypeOrmModule.forFeature([
      Candidatos,
      CandidatoSkill,
      CandidatoIdioma, 
    ]),
  ],
})
export class CandidatosModule {}
