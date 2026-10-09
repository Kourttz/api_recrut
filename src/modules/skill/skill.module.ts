import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity'; 
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), AuthModule],
  providers: [SkillService],
  exports: [SkillService, TypeOrmModule.forFeature([Skill])],
})
export class SkillModule {}