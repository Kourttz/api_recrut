import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaInitService } from './modules/kafka/kafka.init.service';
import { AuthModule } from './common/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { SkillModule } from './modules/skill/skill.module';
import { VagasModule } from './modules/vagas/vagas.module';
import { IdiomaModule } from './modules/idioma/idioma.module';
import { StatusModule } from './modules/status/status.module';
import { FuncoesModule } from './modules/funcoes/funcoes.module';
import { UnidadesModule } from './modules/unidades/unidades.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CandidatosModule } from './modules/candidatos/candidatos.module';
import { EmpregadosModule } from './modules/empregados/empregados.module';
import { CandidaturasModule } from './modules/candidaturas/candidaturas.module';
import { HistoricoCandidaturaModule } from './modules/historico_candidatura/historico_candidatura.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      logging: false,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [__dirname + '/migrations/*{.js,.ts}']
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    TokenModule,
    KafkaModule,
    SkillModule,
    VagasModule,
    IdiomaModule,
    StatusModule,
    FuncoesModule,
    UnidadesModule,
    UsuariosModule,
    EmpregadosModule,
    CandidatosModule,
    CandidaturasModule,
    HistoricoCandidaturaModule,
  ],
  controllers: [],
  providers: [
    KafkaInitService,
  ],
})
export class AppModule { }
