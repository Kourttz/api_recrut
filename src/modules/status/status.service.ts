import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  /**
   * 
   * @returns Lista todas os status
   */
  async listarStatus(): Promise<Status[]> {
    return this.statusRepository.find();
  }

  /**
   * 
   * @param id ID do status a ser obtida
   * @returns Obtém um status pelo seu código
   */
  async obterStatusPorCodigo(id: number): Promise<Status> {
    const status = await this.statusRepository.findOneBy({ coStatus: id });

    if (!status) {
      throw new HttpException(
        `Status com código ${id} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return status;
  }

  /**
   * 
   * @param dados Dados para criar uma nova status
   * @returns 
   */   
  async criarStatus(dados: Partial<Status>): Promise<Status> {

    /* Verifica se o campo coStatus foi fornecido */
    if (dados.coStatus) {
      throw new HttpException(
        'Não é permitido informar um ID (coStatus) para o novo status',
        HttpStatus.BAD_REQUEST,
      );
    }

    const status = this.statusRepository.create(dados);
    return await this.statusRepository.save(status);
  }

  /**
   * 
   * @param id ID da status a ser atualizado
   * @param dados 
   * @returns 
   */ 
  async atualizarStatus(id: number, dados: Partial<Status>): Promise<Status> {

    /* Impede a atualização direta do campo icSituacaoAtivo */
    if (dados.icSituacaoAtivo !== undefined) {
      throw new HttpException(
        'Não é permitido atualizar icSituacaoAtivo diretamente. Use o endpoint de alternar status.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resultado = await this.statusRepository.update(id, dados);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Status não encontrado para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const statusAtualizado = await this.statusRepository.findOneBy({ coStatus: id });

    /* Verifica se a status atualizada foi recuperada com sucesso */
    if (!statusAtualizado) {
      throw new HttpException(
        'Erro ao recuperar status após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return statusAtualizado;
  }

  /**
   * 
   * @param id ID da status a ser deletada
   */
  async deletarStatus(id: number): Promise<void> {

    const resultado = await this.statusRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Status não encontrado para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** 
   *  
   * @param id ID da status para alternar o status
   * @return Ação com o status alternado
   */    
  async alternarStatus(id: number): Promise<Status> {

    const status = await this.statusRepository.findOneBy({ coStatus: id });

    /* Verifica se a status foi encontrada */
    if (!status) {
      throw new HttpException(
        'Status não encontrado para alternar status',
        HttpStatus.NOT_FOUND,
      );
    }

    status.icSituacaoAtivo = !status.icSituacaoAtivo;
    await this.statusRepository.save(status);

    return status;
  }
}
