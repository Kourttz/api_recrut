import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcoes } from './funcoes.entity';

@Injectable()
export class FuncoesService {
  constructor(
    @InjectRepository(Funcoes)
    private readonly funcoesRepository: Repository<Funcoes>,
  ) {}

  /**
   * 
   * @returns Lista todas as funcoes
   */
  async listarFuncoes(): Promise<Funcoes[]> {
    return this.funcoesRepository.find();
  }

  /**
   * 
   * @param id ID da funcao a ser obtida
   * @returns Obtém uma funcao pelo seu código
   */
  async obterFuncaoPorCodigo(id: number): Promise<Funcoes> {
    const funcao = await this.funcoesRepository.findOneBy({ coFuncao: id });

    if (!funcao) {
      throw new HttpException(
        `Função com código ${id} não encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return funcao;
  }

  /**
   * 
   * @param dados Dados para criar uma nova funcao
   * @returns 
   */   
  async criarFuncao(dados: Partial<Funcoes>): Promise<Funcoes> {

    /* Verifica se o campo coFuncao foi fornecido */
    if (dados.coFuncao) {
      throw new HttpException(
        'Não é permitido informar um ID (coFuncao) para a nova funcao',
        HttpStatus.BAD_REQUEST,
      );
    }

    const funcao = this.funcoesRepository.create(dados);
    return await this.funcoesRepository.save(funcao);
  }

  /**
   * 
   * @param id ID da funcao a ser atualizado
   * @param dados 
   * @returns 
   */ 
  async atualizarFuncao(id: number, dados: Partial<Funcoes>): Promise<Funcoes> {

    /* Impede a atualização direta do campo icSituacaoAtivo */
    if (dados.icSituacaoAtivo !== undefined) {
      throw new HttpException(
        'Não é permitido atualizar icSituacaoAtivo diretamente. Use o endpoint de alternar status.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resultado = await this.funcoesRepository.update(id, dados);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Função não encontrada para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const funcaoAtualizado = await this.funcoesRepository.findOneBy({ coFuncao: id });

    /* Verifica se a funcao atualizada foi recuperada com sucesso */
    if (!funcaoAtualizado) {
      throw new HttpException(
        'Erro ao recuperar funcao após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return funcaoAtualizado;
  }

  /**
   * 
   * @param id ID da funcao a ser deletada
   */
  async deletarFuncao(id: number): Promise<void> {

    const resultado = await this.funcoesRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Função não encontrada para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** 
   *  
   * @param id ID da funcao para alternar o status
   * @return Ação com o status alternado
   */    
  async alternarStatus(id: number): Promise<Funcoes> {

    const funcao = await this.funcoesRepository.findOneBy({ coFuncao: id });

    /* Verifica se a funcao foi encontrada */
    if (!funcao) {
      throw new HttpException(
        'Função não encontrada para alternar status',
        HttpStatus.NOT_FOUND,
      );
    }

    funcao.icSituacaoAtivo = !funcao.icSituacaoAtivo;
    await this.funcoesRepository.save(funcao);

    return funcao;
  }
}
