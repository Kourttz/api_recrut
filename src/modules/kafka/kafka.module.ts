import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaService } from './kafka.service';
import { LinkModule } from '../link/link.module';
import { SkillModule } from '../skill/skill.module';
import { VagasModule } from '../vagas/vagas.module';
import { IdiomaModule } from '../idioma/idioma.module';
import { ProjetoModule } from '../projeto/projeto.module';
import { UnidadesModule } from '../unidades/unidades.module';
import { EducacaoModule } from '../educacao/educacao.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { EmpregadosModule } from '../empregados/empregados.module';
import { CandidatosModule } from '../candidatos/candidatos.module'; 
import { ExperienciaModule } from '../experiencia/experiencia.module';
import { CertificacaoModule } from '../certificacao/certificacao.module';
import { CandidaturasModule } from '../candidaturas/candidaturas.module';
import { CandidatoSkillModule } from '../candidato_skill/candidato_skill.module';
import { CandidatoIdiomaModule } from '../candidato_idioma/candidato_idioma.module';
import { Link } from '../link/link.entity';
import { Idioma } from '../idioma/idioma.entity';
import { Skill } from '../skill/skill.entity';
import { Projeto } from '../projeto/projeto.entity';
import { Unidades } from '../unidades/unidades.entity';
import { Educacao } from '../educacao/educacao.entity';
import { Usuarios } from '../usuarios/usuarios.entity';
import { Candidatos } from '../candidatos/candidatos.entity';
import { Experiencia } from '../experiencia/experiencia.entity';
import { Certificacao } from '../certificacao/certificacao.entity';
import { Candidaturas } from '../candidaturas/candidaturas.entity';
import { Empregado } from '../empregados/entities/empregado.entity';
import { CandidatoSkill } from '../candidato_skill/candidato_skill.entity';
import { CandidatoIdioma } from '../candidato_idioma/candidato_idioma.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [
    LinkModule,
    SkillModule,
    IdiomaModule,
    ProjetoModule,
    UnidadesModule,
    EducacaoModule,
    UsuariosModule,
    EmpregadosModule, 
    CandidatosModule, 
    ExperienciaModule,
    CertificacaoModule,
    forwardRef(() => VagasModule),
    forwardRef(() => CandidaturasModule),
    CandidatoSkillModule,
    CandidatoIdiomaModule,
    TypeOrmModule.forFeature([ 
    Link,
    Skill,
    Idioma,
    CandidatoIdioma,
    Projeto,
    Unidades,
    Educacao,
    Usuarios,
    Empregado,
    Candidatos,
    Experiencia,
    Certificacao,
    Candidaturas,
    CandidatoSkill
     ]),
    AuthModule
  ],  
  providers: [KafkaService], 
  exports: [KafkaService],
})
export class KafkaModule {}