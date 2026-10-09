import {
  Controller, Post, Body, Get, Patch, Delete, Put,
  UseFilters, HttpStatus, Req, Param, ParseIntPipe,
  UseGuards, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CandidatosService } from './candidatos.service';
import { Candidatos } from './candidatos.entity';
import { 
  CriarCandidatoDto, 
  AtualizarCandidatoDto, 
  MOCK_CRIAR_CANDIDATO_COMPLETO, 
  MOCK_ATUALIZAR_CANDIDATO_PARCIAL,
  MOCK_ATUALIZAR_CANDIDATO_DELETE_GROUP,
  MOCK_ATUALIZAR_CANDIDATO_DELETE_ALL
} from './candidatos.dto';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IQueryParams } from '../../common/interfaces/query-params.interface';
import { ApiPaginatedResponse } from '../../common/decorator/api-paginated.decorator';

@ApiBearerAuth('access-token')
@ApiTags('Candidatos')
@UseFilters(HttpExceptionFilter)
@Controller('candidatos')
export class CandidatosController {
  constructor(private readonly candidatosService: CandidatosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os Candidatos com paginação e busca' })
  @ApiPaginatedResponse({
    searchDesc: 'Busca global por Nome, Headline, Resumo, Email ou Localização',
    orderExample: 'Exemplo: order[coVaga]=DESC ou order[dtCriadoEm]=ASC',
    filters: [
      // Filtros de Identificação
      { name: 'noCandidato', description: 'Filtrar por nome do candidato (parcial)', type: String },
      { name: 'coCpf', description: 'Filtrar por CPF exato (somente números)', type: String },
      { name: 'noEmail', description: 'Filtrar por e-mail', type: String },
      
      // Filtros de Localização e Contato
      { name: 'noLocalizacao', description: 'Filtrar por cidade/estado (parcial)', type: String },
      { name: 'nuTelefone', description: 'Filtrar por telefone', type: String },
      
      // Filtros de Data
      { name: 'dtNascimento', description: 'Filtrar por data de nascimento (YYYY-MM-DD)', type: String },
      { name: 'dtCriadoEm', description: 'Filtrar por data de cadastro (YYYY-MM-DD)', type: String },
    ]
  })
  async listar(
    @Req() request: Request,
    @Query() query: IQueryParams,
  ): Promise<ResponseDto<any>> {
    const resultado = await this.candidatosService.listarCandidatos(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidatos listados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: resultado,
    };
  }

  @Get('id/:coCandidato')
  @ApiOperation({ summary: 'Obtém currículo completo do Candidato pelo ID' })
  @ApiParam({ name: 'coCandidato', type: Number })
  async obterPorCodigo(
    @Param('coCandidato', ParseIntPipe) id: number,
    @Req() request: Request
  ): Promise<ResponseDto<Candidatos>> {
    const candidato = await this.candidatosService.obterCandidatoPorCodigo(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidato obtido com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: candidato,
    };
  }

  @Get(':coCpf')
  @ApiOperation({ summary: 'Obtém currículo completo do Candidato pelo CPF' })
  @ApiParam({ name: 'coCpf', type: String })
  async obterPorCPF(
    @Param('coCpf') cpf: string,
    @Req() request: Request
  ): Promise<ResponseDto<Candidatos>> {
    const candidato = await this.candidatosService.obterCandidatoPorCPF(cpf);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidato obtido com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: candidato,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria Candidato e todos os dados vinculados (Experiência, etc.)' })
  @ApiBody({ 
    type: CriarCandidatoDto,
    examples: {
        criacaoCompleta: {
            summary: 'Exemplo de Criação Completa de Candidato',
            value: MOCK_CRIAR_CANDIDATO_COMPLETO,
        },
    },
  })
  async criar(
    @Body() dados: CriarCandidatoDto,
    @Req() request: Request
  ): Promise<ResponseDto<Candidatos>> {
    const novoCandidato = await this.candidatosService.criarCandidato(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Candidato e currículo criados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: novoCandidato,
    };
  }

  @Patch(':coCandidato')
  @ApiOperation({ summary: 'Atualiza dados cadastrais principais do Candidato' })
  @ApiParam({ name: 'coCandidato', type: Number })
  @ApiBody({ 
    type: AtualizarCandidatoDto,
    examples: {
      atualizacaoParcial: {
        summary: 'Exemplo de Atualização Parcial',
        value: MOCK_ATUALIZAR_CANDIDATO_PARCIAL,
    },
      delecaoParcial: {
        summary: 'Exemplo de Deleção Parcial',
        value: MOCK_ATUALIZAR_CANDIDATO_DELETE_GROUP,
    },
      delecaoTotal: {
        summary: 'Exemplo de Deleção Total',
        value: MOCK_ATUALIZAR_CANDIDATO_DELETE_ALL,
    },
  },
  })
  async atualizar(
    @Param('coCandidato', ParseIntPipe) id: number,
    @Body() dados: AtualizarCandidatoDto,
    @Req() request: Request
  ): Promise<ResponseDto<Candidatos>> {
    const candidatoAtualizado = await this.candidatosService.atualizarCandidato(id, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dados do candidato atualizados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: candidatoAtualizado,
    };
  }

  @Delete(':coCandidato')
  @ApiOperation({ summary: 'Deleta Candidato e todos os vínculos' })
  @ApiParam({ name: 'coCandidato', type: Number })
  async deletar(
    @Param('coCandidato', ParseIntPipe) id: number,
    @Req() request: Request
  ): Promise<ResponseDto<null>> {
    await this.candidatosService.deletarCandidato(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidato deletado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }
}