import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidatoIdioma } from '../candidato_idioma/candidato_idioma.entity'; 

@Injectable()
export class CandidatoIdiomaService {
  constructor(
    @InjectRepository(CandidatoIdioma)
    private readonly idiomaRepository: Repository<CandidatoIdioma>,
  ) {}

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.idiomaRepository.insert(data);
    console.log(`🆕 Candidato Idioma criado: ${data.coCandidatoIdioma}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.idiomaRepository.update({ coCandidatoIdioma: id }, data);
    console.log(`✏️ Candidato Idioma atualizado: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.idiomaRepository.delete({ coCandidatoIdioma: id });
    console.log(`🗑️ Candidato Idioma deletado: ${id}`);
  }
}