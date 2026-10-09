import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Educacao } from './educacao.entity'; 

@Injectable()
export class EducacaoService {
  constructor(
    @InjectRepository(Educacao)
    private readonly educacaoRepository: Repository<Educacao>,
  ) {}

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.educacaoRepository.insert(data);
    console.log(`🆕 Educação criada: ${data.coEducacao}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.educacaoRepository.update({ coEducacao: id }, data);
    console.log(`✏️ Educação atualizada: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.educacaoRepository.delete({ coEducacao: id });
    console.log(`🗑️ Educação deletada: ${id}`);
  }
}