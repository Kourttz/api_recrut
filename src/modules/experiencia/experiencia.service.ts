import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiencia } from './experiencia.entity';



@Injectable()
export class ExperienciaService {
  constructor(
    @InjectRepository(Experiencia)
    private readonly ExperienciaRepository: Repository<Experiencia>,
  ) {}

  
  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.ExperienciaRepository.insert(data);
    console.log(`🆕 Experiencia criada: ${data.co_experiencia}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.ExperienciaRepository.update({ coExperiencia: id }, data);
    console.log(`✏️ Experiencia atualizada: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.ExperienciaRepository.delete({ coExperiencia: id });
    console.log(`🗑️ Experiencia deletada: ${id}`);
  }
 
}
