import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatoSkillService } from './candidato_skill.service';
import { CandidatoSkill } from './candidato_skill.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CandidatoSkill]), AuthModule],
  providers: [CandidatoSkillService],
  exports: [CandidatoSkillService]
})
export class CandidatoSkillModule {}
