import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidatoSkill } from './candidato_skill.entity'; 

@Injectable()
export class CandidatoSkillService {
  constructor(
    @InjectRepository(CandidatoSkill)
    private readonly candidatoSkillRepository: Repository<CandidatoSkill>,
  ) {}

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.candidatoSkillRepository.insert(data);
    console.log(`🆕 Vínculo CandidatoSkill criado: ${data.coCandidatoSkill}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.candidatoSkillRepository.update({ coCandidatoSkill: id }, data);
    console.log(`✏️ Vínculo CandidatoSkill atualizado: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.candidatoSkillRepository.delete({ coCandidatoSkill: id });
    console.log(`🗑️ Vínculo CandidatoSkill deletado: ${id}`);
  }
}