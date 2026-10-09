import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from './projeto.entity'; 

@Injectable()
export class ProjetoService {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
  ) {}

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.projetoRepository.insert(data);
    console.log(`🆕 Projeto criado: ${data.coProjeto}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.projetoRepository.update({ coProjeto: id }, data);
    console.log(`✏️ Projeto atualizado: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.projetoRepository.delete({ coProjeto: id });
    console.log(`🗑️ Projeto deletado: ${id}`);
  }
}