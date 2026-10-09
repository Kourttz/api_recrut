import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Candidaturas } from './candidaturas.entity';
import { FuncaoCandidatura } from '../funcao_candidatura/funcao_candidatura.entity';
import { StatusAgendado } from '../status_agendado/status_agendado.entity';
import { CriarCandidaturaDto, AtualizarStatusCandidaturaDto, AtualizarResponsavelCandidaturaDto } from './candidaturas.dto';

import { Vagas } from '../vagas/vagas.entity';
import { Status } from '../status/status.entity';
import { Candidatos } from '../candidatos/candidatos.entity';
import { Funcoes } from '../funcoes/funcoes.entity';
import { HistoricoCandidatura } from '../historico_candidatura/historico_candidatura.entity';
import { IQueryParams } from '../../common/interfaces/query-params.interface';
import { paginate } from '../../common/utils/pagination.util';

const STATUS_AGENDADO_ID = 29;

@Injectable()
export class CandidaturasService {
  constructor(
    @InjectRepository(Candidaturas)
    private readonly candidaturasRepository: Repository<Candidaturas>,

    @InjectRepository(FuncaoCandidatura)
    private readonly funcaoCandidaturaRepository: Repository<FuncaoCandidatura>,

    @InjectRepository(StatusAgendado)
    private readonly statusAgendadoRepository: Repository<StatusAgendado>,

    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // RELATIONS (AJUSTADO PARA OneToOne)
  // =====================================================
  private readonly relations = [
    'vaga',
    'vaga.unidade',
    'vaga.usuarioCadastro',
    'vaga.usuarioAtualizacao',
    'status',
    'funcaoCandidatura',
    'funcaoCandidatura.candidato',
    'funcaoCandidatura.funcao',
    'statusAgendado',
    'usuarioAtribuido',
  ];

  // =====================================================
  // LISTAR
  // =====================================================
  async listarCandidaturas(query: IQueryParams) {
    const searchFields = [
      'vaga.noVaga',
      'vaga.noCidadeExecucao',
      'vaga.unidade.noProjeto', 
      'funcaoCandidatura.candidato.noCandidato',
      'funcaoCandidatura.candidato.coCpf',
      'funcaoCandidatura.candidato.noEmail',
      'funcaoCandidatura.candidato.nuTelefone',
      'funcaoCandidatura.funcao.noFuncao', 
      'vaga.tpVaga',
      'status.noStatus'
    ]; 
    
    return paginate<Candidaturas>(
      this.candidaturasRepository, 
      query, 
      {
        relations: this.relations,
        order: { dtCriadoEm: 'DESC' }
      },
      searchFields
    );
  }

  // =====================================================
  // OBTER POR ID
  // =====================================================
  async obterCandidaturaPorCodigo(id: number): Promise<Candidaturas> {
    const candidatura = await this.candidaturasRepository.findOne({
      where: { coCandidatura: id },
      relations: this.relations,
    });

    if (!candidatura) {
      throw new HttpException(
        `Candidatura com código ${id} não encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return candidatura;
  }

  // =====================================================
  // CRIAR CANDIDATURA
  // =====================================================
  async criarCandidatura(data: CriarCandidaturaDto): Promise<Candidaturas> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const vagaRepo = queryRunner.manager.getRepository(Vagas);
      const statusRepo = queryRunner.manager.getRepository(Status);
      const candidatoRepo = queryRunner.manager.getRepository(Candidatos);
      const funcoesRepo = queryRunner.manager.getRepository(Funcoes);

      const [vaga, status, candidato, funcao] = await Promise.all([
        vagaRepo.findOneBy({ coVaga: data.coVaga }),
        statusRepo.findOneBy({ coStatus: data.coStatus }),
        candidatoRepo.findOneBy({ coCandidato: data.coCandidato }),
        funcoesRepo.findOneBy({ coFuncao: data.coFuncao }),
      ]);

      if (!vaga) throw new HttpException(`Vaga ${data.coVaga} não existe.`, HttpStatus.BAD_REQUEST);
      if (!status) throw new HttpException(`Status ${data.coStatus} não existe.`, HttpStatus.BAD_REQUEST);
      if (!candidato) throw new HttpException(`Candidato ${data.coCandidato} não existe.`, HttpStatus.BAD_REQUEST);
      if (!funcao) throw new HttpException(`Função ${data.coFuncao} não existe.`, HttpStatus.BAD_REQUEST);

      const funcaoCandidatura = await queryRunner.manager.save(
        this.funcaoCandidaturaRepository.create({
          coFuncao: data.coFuncao,
          coCandidato: data.coCandidato,
        }),
      );

      const candidatura = await queryRunner.manager.save(
        this.candidaturasRepository.create({
          coVaga: data.coVaga,
          coStatus: data.coStatus,
          coFuncaoCandidatura: funcaoCandidatura.coFuncaoCandidatura,
        }),
      );

      if (data.coStatus === STATUS_AGENDADO_ID) {
        if (!data.dtStatus) {
          throw new HttpException(
            `dtStatus é obrigatório para status ${STATUS_AGENDADO_ID}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        await queryRunner.manager.save(
          this.statusAgendadoRepository.create({
            coCandidatura: candidatura.coCandidatura,
            dtStatus: new Date(data.dtStatus),
          }),
        );
      }

      await queryRunner.commitTransaction();
      return this.obterCandidaturaPorCodigo(candidatura.coCandidatura);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) throw err;
      throw new HttpException('Erro ao criar candidatura.', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  // =====================================================
  // ATUALIZAR STATUS DA CANDIDATURA 
  // =====================================================
  async atualizarCandidatura(
    coCandidatura: number,
    dados: AtualizarStatusCandidaturaDto,
    coUsuario: number,
  ): Promise<Candidaturas> {
  
    if (dados.coStatus === undefined) {
      throw new HttpException(
        'A atualização permite apenas alteração de status.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // 1. Buscar a candidatura e o nome do status ATUAL
      const candidaturaAntes = await queryRunner.manager.findOne(Candidaturas, {
        where: { coCandidatura },
        relations: ['status'], 
      });

      if (!candidaturaAntes) {
        throw new HttpException('Candidatura não encontrada.', HttpStatus.NOT_FOUND);
      }

      // 2. Buscar as informações do NOVO status para o texto do histórico
      const novoStatusEntity = await queryRunner.manager.findOne(Status, {
        where: { coStatus: dados.coStatus }
      });

      const nomeStatusAnterior = candidaturaAntes.status?.noStatus || `ID ${candidaturaAntes.coStatus}`;
      const nomeStatusNovo = novoStatusEntity?.noStatus || `ID ${dados.coStatus}`;

      // 3. Realizar o Update na Candidatura
      await queryRunner.manager.update(
        Candidaturas,
        { coCandidatura },
        { coStatus: dados.coStatus },
      );
  
      // 4. Gerar Registro de Histórico
      const mensagemHistorico = `Alteração de status: de "${nomeStatusAnterior}" para "${nomeStatusNovo}".`;
      
      const novoHistorico = queryRunner.manager.create(HistoricoCandidatura, {
        coCandidatura,
        coUsuario,
        noHistorico: mensagemHistorico,
      });
      await queryRunner.manager.save(novoHistorico);

      // 5. Lógica de Status Agendado
      if (dados.coStatus === STATUS_AGENDADO_ID) {
        if (!dados.dtStatus) {
          throw new HttpException(
            `dtStatus é obrigatório para status ${STATUS_AGENDADO_ID}`,
            HttpStatus.BAD_REQUEST,
          );
        }
  
        const existente = await queryRunner.manager.findOneBy(StatusAgendado, {
          coCandidatura,
        });
  
        if (existente) {
          existente.dtStatus = new Date(dados.dtStatus);
          await queryRunner.manager.save(existente);
        } else {
          await queryRunner.manager.save(
            queryRunner.manager.create(StatusAgendado, {
              coCandidatura,
              dtStatus: new Date(dados.dtStatus),
            }),
          );
        }
      } else {
        await queryRunner.manager.delete(StatusAgendado, { coCandidatura });
      }
  
      await queryRunner.commitTransaction();
  
      // 🔄 recarrega do banco para retornar o objeto atualizado
      return this.obterCandidaturaPorCodigo(coCandidatura);
  
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        `Erro ao atualizar status: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // =====================================================
  // DELETAR CANDIDATURA
  // =====================================================
  async deletarCandidatura(id: number): Promise<void> {
    const candidatura = await this.obterCandidaturaPorCodigo(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Candidaturas, { coCandidatura: id });
      await queryRunner.manager.delete(FuncaoCandidatura, {
        coFuncaoCandidatura: candidatura.coFuncaoCandidatura,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) throw err;
      throw new HttpException('Erro ao deletar candidatura.', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  // =====================================================
  // ATRIBUIR RESPONSÁVEL
  // =====================================================
  async atualizarResponsavel(
    coCandidatura: number,
    dto: AtualizarResponsavelCandidaturaDto,
  ) {
    try {
      const candidatura = await this.candidaturasRepository.findOne({
        where: { coCandidatura },
      });
  
      if (!candidatura) {
        throw new HttpException(
          'Candidatura não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
  
      if (dto.coUsuarioAtribuido !== undefined) {
        candidatura.coUsuarioAtribuido = dto.coUsuarioAtribuido;
      }
  
      await this.candidaturasRepository.save(candidatura);
  
      return candidatura;
  
    } catch (err) {
      throw new HttpException(
        err.message || 'Erro ao atualizar responsável',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // =====================================================
  // KAFKA – RESPEITA A MESMA REGRA DE STATUS
  // =====================================================
  async processarMensagemKafka(data: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const vaga = await queryRunner.manager.findOneBy(Vagas, { coVaga: data.coVaga });
      if (!vaga) return;

      const candidato = await queryRunner.manager.findOneBy(Candidatos, { coCpf: data.coCpf });
      if (!candidato) return;

      let funcaoCandidatura = await queryRunner.manager.findOne(FuncaoCandidatura, {
        where: { coCandidato: candidato.coCandidato, coFuncao: vaga.coFuncao },
      });

      if (!funcaoCandidatura) {
        funcaoCandidatura = await queryRunner.manager.save(
          queryRunner.manager.create(FuncaoCandidatura, {
            coCandidato: candidato.coCandidato,
            coFuncao: vaga.coFuncao,
          }),
        );
      }

      let candidatura = await queryRunner.manager.findOne(Candidaturas, {
        where: {
          coVaga: vaga.coVaga,
          coFuncaoCandidatura: funcaoCandidatura.coFuncaoCandidatura,
        },
      });

      if (!candidatura) {
        candidatura = await queryRunner.manager.save(
          queryRunner.manager.create(Candidaturas, {
            coVaga: vaga.coVaga,
            coFuncaoCandidatura: funcaoCandidatura.coFuncaoCandidatura,
            coStatus: data.coStatus || 2,
          }),
        );
      }

      if (data.coStatus && candidatura.coStatus !== data.coStatus) {
        candidatura.coStatus = data.coStatus;
        await queryRunner.manager.save(candidatura);

        if (data.coStatus === STATUS_AGENDADO_ID) {
          if (!data.dtStatus) {
            throw new Error('dtStatus obrigatório para status AGENDADO no Kafka');
          }

          const ag = await queryRunner.manager.findOneBy(StatusAgendado, {
            coCandidatura: candidatura.coCandidatura,
          });

          if (ag) {
            ag.dtStatus = new Date(data.dtStatus);
            await queryRunner.manager.save(ag);
          } else {
            await queryRunner.manager.save(
              queryRunner.manager.create(StatusAgendado, {
                coCandidatura: candidatura.coCandidatura,
                dtStatus: new Date(data.dtStatus),
              }),
            );
          }
        } else {
          await queryRunner.manager.delete(StatusAgendado, {
            coCandidatura: candidatura.coCandidatura,
          });
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao processar Kafka:', err);
    } finally {
      await queryRunner.release();
    }
  }
}
