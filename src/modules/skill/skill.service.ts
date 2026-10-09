import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity'; 

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  /**
   * Encontra a Skill pelo nome ou a cria se não existir (UPSERT).
   * @param noSkill Nome da Skill.
   * @returns A Skill Entity, existente ou recém-criada.
   */
  async findOrCreateSkill(noSkill: string): Promise<Skill> {
    const normalized = noSkill.trim().toLowerCase();
  
    // Busca case-insensitive
    const existing = await this.skillRepository
      .createQueryBuilder('s')
      .where('LOWER(TRIM(s.noSkill)) = :name', { name: normalized })
      .getOne();
  
    if (existing) {
      return existing;
    }
  
    try {
      const skill = this.skillRepository.create({
        noSkill: normalized,
      });
  
      return await this.skillRepository.save(skill);
    } catch (err: any) {
      // PostgreSQL unique violation
      if (err.code === '23505') {
        const skill = await this.skillRepository
          .createQueryBuilder('s')
          .where('LOWER(TRIM(s.noSkill)) = :name', { name: normalized })
          .getOne();
  
        if (skill) return skill;
      }
  
      throw err;
    }
  }  

   /* FUNÇÕES DIRECIONADAS AO KAFKA */

   async create(data: any): Promise<void> {
    await this.findOrCreateSkill(data.noSkill);
    console.log(`🆕 Skill criado: ${data.coSkill}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.skillRepository.update({ coSkill: id }, data);
    console.log(`✏️ Skill atualizado: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.skillRepository.delete({ coSkill: id });
    console.log(`🗑️ Skill deletado: ${id}`);
  }

}