import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vagas } from './vagas.entity';
import { CriarVagaDto, AtualizarVagaDto } from './vagas.dto'; 
import { IQueryParams } from '../../common/interfaces/query-params.interface';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class VagasService {
  constructor(
    @InjectRepository(Vagas)
    private readonly vagasRepository: Repository<Vagas>,
  ) {}

  private readonly relations = [
    'unidade',
    'funcao',
    'usuarioCadastro',
    'usuarioAtualizacao',
  ];

  /**
   * Lista todas as vagas trazendo os relacionamentos (unidade e função)
   */
  async listarVagas(query: IQueryParams) {
    const searchFields = [
      'noVaga',
      'deVaga',
      'noCidadeExecucao',
      'tpVaga',
      'noStatus',
      'noNivel',
      'unidade.noProjeto',      
      'unidade.noRazaoSocial',  
      'funcao.noFuncao',
    ];
  
    return paginate<Vagas>(
      this.vagasRepository, 
      query, 
      {
        relations: this.relations,
        relationLoadStrategy: 'query',
        order: { coVaga: 'ASC' },
      },
      searchFields
    );
  }

  /**
   * Obtém uma vaga pelo ID trazendo os relacionamentos
   */
  async obterVagaPorCodigo(id: number): Promise<Vagas> {
    const vaga = await this.vagasRepository.findOne({
      where: { coVaga: id },
      relations: this.relations,
    });

    if (!vaga) {
      throw new HttpException(
        `Vaga com código ${id} não encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return vaga;
  }

  /**
   * Cria uma nova vaga
   * @param dados DTO com os dados para criação
   */
  async criarVaga(dados: CriarVagaDto): Promise<Vagas> {

    // O TypeORM cuida da criação do objeto e da validação (caso use DTOs na Entity)
    const novaVaga = this.vagasRepository.create(dados);

    return await this.vagasRepository.save(novaVaga);
  }

  /**
   * Atualiza dados gerais da vaga (PATCH)
   * @param id ID da vaga a ser atualizada
   * @param dados DTO com os dados para atualização parcial
   */
  async atualizarVaga(id: number, dados: AtualizarVagaDto): Promise<Vagas> {
    try {
      // 1. Tenta atualizar no banco de dados
      const resultado = await this.vagasRepository.update(id, dados);

      if (resultado.affected === 0) {
        throw new HttpException(
          'Vaga não encontrada para atualização',
          HttpStatus.NOT_FOUND,
        );
      }
      
      // 2. Retorna o objeto atualizado com relacionamentos
      return await this.obterVagaPorCodigo(id); 

    } catch (error) {
      // 3. Trata o erro de Chave Estrangeira (FK)
      if (error.code === '23503') { 
        
        const mensagemDetalhada = error.detail || 'Dados relacionados (Unidade ou Função) não existem.';

        throw new HttpException(
          `Erro de integridade de dados: ${mensagemDetalhada}`,
          HttpStatus.BAD_REQUEST, 
        );
      }

      throw error;
    }
  }

  /**
   * Deleta a vaga
   * @param id ID da vaga a ser deletada
   */
  async deletarVaga(id: number): Promise<void> {
    const resultado = await this.vagasRepository.delete(id);

    if (resultado.affected === 0) {
      throw new HttpException(
        'Vaga não encontrada para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** * Alterna o status da vaga (PUT)
   * @param id ID da vaga para alternar o status
   */    
  async alternarStatus(id: number): Promise<Vagas> {
    // Reutiliza o método que já verifica se a vaga existe
    const vaga = await this.obterVagaPorCodigo(id); 

    vaga.icSituacaoAtivo = !vaga.icSituacaoAtivo;
    await this.vagasRepository.save(vaga);

    return vaga;
  }
}