
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empregado } from './entities/empregado.entity';

@Injectable()
export class EmpregadosService {
  constructor(
    @InjectRepository(Empregado)
    private readonly repo: Repository<Empregado>,
    @InjectRepository(Empregado)
    private readonly EmpregadoRepository: Repository<Empregado>,
  ) {}

  
  /**
   * 
   * @returns Lista todos os empregados com seus dados
   */
  async listarEmpregados(): Promise<Empregado[]> {
    return this.EmpregadoRepository.find();
  }

  /**
   * 
   * @param id ID do empregado a ser obtido
   * @returns 
   */
  async obterEmpregadoPorId(id: string): Promise<Empregado> {
    
    const empregado = await this.EmpregadoRepository.findOneBy({ co_matricula: id });

    /* Verifica se o empregado foi encontrado */
    if (!empregado) {
      throw new HttpException(
        'Empregado não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return empregado;
  }

    /**
   * Cria um novo empregado
   */
    async create(data: Empregado): Promise<void> {
      await this.repo.insert(data);
      console.log(`🆕 CREATE - Matrícula ${data.id_empregado} criada`);
    }
  
    /**
     * Atualiza um empregado existente
     */
    async update(id: number, data: any): Promise<void> {
      await this.repo.update({id_empregado: id }, data);
      console.log(`✏️ UPDATE - Matrícula ${id} atualizada`);
    }
  
    /**
     * Deleta um empregado existente
     */
    async delete(id: number): Promise<void> {
      await this.repo.delete({ id_empregado: id });
      console.log(`🗑️ DELETE - Matrícula ${id} deletada`);
    }
}





