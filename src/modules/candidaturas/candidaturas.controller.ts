import {
  Controller, Post, Body, Get, Patch, Delete, Put,
  UseFilters, HttpStatus, Req, Param, ParseIntPipe,
  UseGuards, UseInterceptors, ClassSerializerInterceptor, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery
 } from '@nestjs/swagger';
import { CandidaturasService } from './candidaturas.service';
import { Candidaturas } from './candidaturas.entity';
import { 
  CriarCandidaturaDto, 
  AtualizarStatusCandidaturaDto,
  AtualizarResponsavelCandidaturaDto, 
  MOCK_CRIAR_CANDIDATURA_AGENDADA,
  MOCK_CRIAR_CANDIDATURA_SIMPLES,
  MOCK_ATUALIZAR_STATUS_AGENDADO,
  MOCK_ATUALIZAR_STATUS_SIMPLES
} from './candidaturas.dto';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/auth/jwt_auth_guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../common/decorator/user.decorator';
import { Usuarios } from '../usuarios/usuarios.entity';
import { IQueryParams } from '../../common/interfaces/query-params.interface';
import { ApiPaginatedResponse } from '../../common/decorator/api-paginated.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('access-token')
@ApiTags('Candidaturas')
@UseFilters(HttpExceptionFilter)
@Controller('candidaturas')
@UseGuards(JwtAuthGuard)
export class CandidaturasController {
  constructor(private readonly candidaturasService: CandidaturasService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova Candidatura, registrando em FuncaoCandidatura e StatusAgendado (se Agendado)' })
  @ApiBody({ 
    type: CriarCandidaturaDto,
    examples: {
        simples: {
            summary: 'Exemplo de Criação Simples',
            value: MOCK_CRIAR_CANDIDATURA_SIMPLES,
        },
        agendada: {
          summary: 'Exemplo de Criação com Agendamento (coStatus: 1)',
          value: MOCK_CRIAR_CANDIDATURA_AGENDADA,
      },
    },
  })
  async criar(
    @Body() dados: CriarCandidaturaDto,
    @Req() request: Request
  ): Promise<ResponseDto<Candidaturas>> {
    const novaCandidatura = await this.candidaturasService.criarCandidatura(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Candidatura criada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: novaCandidatura,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as Candidaturas com paginação e busca' })
  @ApiPaginatedResponse({
    searchDesc: 'Busca por Candidato (Nome/CPF/Email), Vaga, Projeto ou Função',
    orderExample: 'Exemplo: order[coVaga]=DESC ou order[dtCriadoEm]=ASC',
    filters: [
      // Filtros diretos da tb_candidaturas
      { name: 'coVaga', description: 'Filtrar por ID da Vaga', type: Number },
      { name: 'coStatus', description: 'Filtrar por ID do Status', type: Number },
      { name: 'dtCriadoEm', description: 'Data da candidatura (YYYY-MM-DD)', type: String },
      { name: 'coUsuarioAtribuido', description: 'Filtrar por ID do Usuário responsável pela candidatura', type: Number },

      // Filtros de Relações (serão tratados via search no Controller)
      { name: 'coUnidade', description: 'Filtrar por ID da Unidade/Projeto', type: Number },
      { name: 'noCidadeExecucao', description: 'Filtrar por Cidade da Vaga', type: String },
      { name: 'tpFormatoTrabalho', description: 'Ex: Presencial, Remoto, Híbrido', type: String },
    ]
  })
  async listar(
    @Req() request: Request,
    @Query() query: IQueryParams
  ): Promise<ResponseDto<any>> {
    
    // Tratamento para campos que podem estar em relações ou causar conflito no paginate
    const { coUnidade, noCidadeExecucao, tpFormatoTrabalho, search, ...outrosFiltros } = query;

    // Injetamos coUnidade, noCidadeExecucao e tpFormatoTrabalho no search para que o paginate use a lógica de searchFields
    const termosExtras = [search, coUnidade, noCidadeExecucao, tpFormatoTrabalho].filter(Boolean).join(' ');

    const queryFormatada: IQueryParams = { ...outrosFiltros };
    if (termosExtras) {
      queryFormatada.search = termosExtras;
    }

    const resultado = await this.candidaturasService.listarCandidaturas(queryFormatada);

    return {
      statusCode: HttpStatus.OK,
      message: 'Candidaturas listadas com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: resultado, 
    };
  }

  @Get(':coCandidatura')
  @ApiOperation({ summary: 'Obtém detalhes da Candidatura pelo ID' })
  @ApiParam({ name: 'coCandidatura', type: Number })
  async obterPorCodigo(
    @Param('coCandidatura', ParseIntPipe) id: number,
    @Req() request: Request
  ): Promise<ResponseDto<Candidaturas>> {
    const candidatura = await this.candidaturasService.obterCandidaturaPorCodigo(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidatura obtida com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: candidatura,
    };
  }

  @Patch(':coCandidatura/status')
  @ApiOperation({
    summary: 'Atualiza exclusivamente o status da candidatura. Gerencia StatusAgendado automaticamente.',
  })
  @ApiParam({ name: 'coCandidatura', type: Number })
  @ApiBody({
    type: AtualizarStatusCandidaturaDto,
    examples: {
      mudancaSimples: {
        summary: 'Atualização simples de status',
        value: MOCK_ATUALIZAR_STATUS_SIMPLES,
      },
      comAgendamento: {
        summary: 'Atualização para status StandBy (coStatus = 29)',
        value: MOCK_ATUALIZAR_STATUS_AGENDADO,
      },
    },
  })
  async atualizarStatus(
    @Param('coCandidatura', ParseIntPipe) id: number,
    @Body() dados: AtualizarStatusCandidaturaDto,
    @User() usuario: Usuarios,
    @Req() request: Request,
  ): Promise<ResponseDto<Candidaturas>> {
    // console.log('Usuário autenticado:', usuario);   
    const coUsuario = usuario?.coUsuario;   
                           

    const candidaturaAtualizada = await this.candidaturasService.atualizarCandidatura(
      id, 
      dados, 
      Number(coUsuario)
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Status da candidatura atualizado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: candidaturaAtualizada,
    };
  }

  @Delete(':coCandidatura')
  @ApiOperation({ summary: 'Deleta a Candidatura e seus registros associados (StatusAgendado, FuncaoCandidatura)' })
  @ApiParam({ name: 'coCandidatura', type: Number })
  async deletar(
    @Param('coCandidatura', ParseIntPipe) id: number,
    @Req() request: Request
  ): Promise<ResponseDto<null>> {
    await this.candidaturasService.deletarCandidatura(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidatura deletada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }

  @Put(':coCandidatura')
  @ApiOperation({ summary: 'Atribuir ou desatribuir responsável da candidatura' })
  @ApiParam({ name: 'coCandidatura', type: Number })
  @ApiBody({
    type: AtualizarResponsavelCandidaturaDto,
    examples: {
      atribuir: {
        summary: 'Atribuir responsável',
        value: {
          coUsuarioAtribuido: 25,
        },
      },
      desatribuir: {
        summary: 'Desatribuir responsável',
        value: {
          coUsuarioAtribuido: null,
        },
      },
    },
  })
  async atribuirResponsavel(
    @Param('coCandidatura', ParseIntPipe) id: number,
    @Body() dto: AtualizarResponsavelCandidaturaDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Candidaturas>> {

    const candidaturaAtualizada =
      await this.candidaturasService.atualizarResponsavel(id, dto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Responsável atualizado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: candidaturaAtualizada,
    };
  }

}