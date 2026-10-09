import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidades } from './unidades.entity';



@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidades)
    private readonly UnidadesRepository: Repository<Unidades>,
  ) {}

  /**
   * 
   * @returns Lista todos os usuários com seus perfis associados
   */
  async listarUnidades(): Promise<Unidades[]> {
    return this.UnidadesRepository.find();
  }

  /**
   * 
   * @param id ID do usuário a ser obtido
   * @returns 
   */
  async obterUnidadePorId(id: number): Promise<Unidades> {
    
    const unidade = await this.UnidadesRepository.findOneBy({ coUnidade: id });

    /* Verifica se o usuário foi encontrado */
    if (!unidade) {
      throw new HttpException(
        'Unidade não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return unidade;
  }

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.UnidadesRepository.insert(data);
    console.log(`🆕 Unidade criada: ${data.co_unidade}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.UnidadesRepository.update({ coUnidade: id }, data);
    console.log(`✏️ Unidade atualizada: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.UnidadesRepository.delete({ coUnidade: id });
    console.log(`🗑️ Unidade deletada: ${id}`);
  }
 
}
