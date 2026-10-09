import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Delete,
    Put,
    UseFilters,
    HttpStatus,
    Req,
    Param,
    ParseIntPipe,
    UseGuards,
    Query
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
  import { VagasService } from './vagas.service';
  import { Vagas } from './vagas.entity';
  import { CriarVagaDto, AtualizarVagaDto } from './vagas.dto';
  import { ResponseDto } from '../../common/filters/response.dto';
  import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
  import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
  import { Request } from 'express';
  import { AuthGuard } from '@nestjs/passport';
  import { IQueryParams } from '../../common/interfaces/query-params.interface';
  import { ApiPaginatedResponse } from '../../common/decorator/api-paginated.decorator';

  
  @ApiBearerAuth('access-token')
  @ApiTags('Vagas')
  @UseFilters(HttpExceptionFilter)
  @Controller('vagas')
  export class VagasController {
    constructor(private readonly vagasService: VagasService) {}
    
    @Get()
    @ApiOperation({ summary: 'Lista todas as Vagas com paginação e busca' })
    @ApiPaginatedResponse({
      searchDesc: 'Busca por Título, Descrição, Projeto, Cidade ou Função',
      orderExample: 'Exemplo: order[coVaga]=DESC ou order[dtCriadoEm]=ASC',
      filters: [
        // Identificadores
        { name: 'coVaga', description: 'ID da Vaga', type: Number },
        { name: 'coUnidade', description: 'ID da Unidade (Projeto)', type: Number },
        { name: 'coFuncao', description: 'ID da Função (Cargo)', type: Number },
        
        // Status e Atividade
        { name: 'noStatus', description: 'Status da vaga (Ex: Em Aberto, Pausada)', type: String },
        { name: 'icSituacaoAtivo', description: 'Vaga ativa? (true/false)', type: Boolean },
        
        // Localização e Formato
        { name: 'noCidadeExecucao', description: 'Cidade de execução', type: String },
        { name: 'noEstado', description: 'Estado (UF)', type: String },
        { name: 'tpFormatoTrabalho', description: 'Formato (Ex: Presencial, Remoto, Híbrido)', type: String },
        
        // Detalhes da Vaga
        { name: 'noNivel', description: 'Nível (Ex: Júnior, Pleno, Sênior)', type: String },
        { name: 'tpVaga', description: 'Tipo (Ex: Efetiva, Temporária)', type: String },
        { name: 'tpRegimeContratacao', description: 'Regime (Ex: CLT, PJ)', type: String },
        { name: 'noAreaAtuacao', description: 'Área de Atuação', type: String },
        { name: 'noProjeto', description: 'Nome do Projeto (Busca parcial)', type: String },
        
        // Datas
        { name: 'dtAbertura', description: 'Data de abertura (YYYY-MM-DD)', type: String },
        { name: 'dtEncerramento', description: 'Data de encerramento (YYYY-MM-DD)', type: String },
        { name: 'dtCriadoEm', description: 'Data de criação (YYYY-MM-DD)', type: String },
      ]
    })
    async listar(
      @Req() request: Request,
      @Query() query: IQueryParams,
    ): Promise<ResponseDto<any>> {
      
      // Tratamento para campos que podem estar em relações ou causar conflito no paginate
      const { coUnidade, noProjeto, search, ...outrosFiltros } = query;

      // Injetamos coUnidade e noProjeto no search para que o paginate use a lógica de searchFields
      const termosExtras = [search, coUnidade, noProjeto].filter(Boolean).join(' ');

      const queryFormatada: IQueryParams = { ...outrosFiltros };
      if (termosExtras) {
        queryFormatada.search = termosExtras;
      }

      const resultado = await this.vagasService.listarVagas(queryFormatada);

      return {
        statusCode: HttpStatus.OK,
        message: 'Vagas listadas com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: resultado,
      };
    }
    
    @Get(':coVaga')
    @ApiOperation({ summary: 'Obtém uma Vaga pelo código' })
    @ApiParam({ name: 'coVaga', type: Number, description: 'ID da Vaga a ser obtida' })
    async obterPorCodigo(
      @Req() request: Request, 
      @Param('coVaga', ParseIntPipe) coVaga: number
    ): Promise<ResponseDto<Vagas>> {
      const vaga = await this.vagasService.obterVagaPorCodigo(coVaga);
      return {
        statusCode: HttpStatus.OK,
        message: 'Vaga obtida com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: vaga,
      };
    }
    
    @Post()
    @ApiOperation({ summary: 'Cria uma nova Vaga' })
    @ApiBody({ type: CriarVagaDto })
    async criar(
      @Body() dados: CriarVagaDto,
      @Req() request: Request,
    ): Promise<ResponseDto<Vagas>> {
      const vaga = await this.vagasService.criarVaga(dados);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Vaga criada com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: vaga,
      };
    }
    
    @Patch(':coVaga')
    @ApiOperation({ summary: 'Atualiza parcialmente uma vaga existente' })
    @ApiParam({ name: 'coVaga', type: Number, description: 'ID da Vaga' })
    @ApiBody({ type: AtualizarVagaDto })
    async atualizar(
      @Param('coVaga', ParseIntPipe) id: number,
      @Body() dados: AtualizarVagaDto,
      @Req() request: Request,
    ): Promise<ResponseDto<Vagas>> {
      const vagaAtualizada = await this.vagasService.atualizarVaga(id, dados);
      return {
        statusCode: HttpStatus.OK,
        message: 'Vaga atualizada com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: vagaAtualizada,
      };
    }
    
    @Delete(':coVaga')
    @ApiOperation({ summary: 'Deleta uma vaga existente' })
    @ApiParam({ name: 'coVaga', type: Number, description: 'ID da Vaga' })
    async deletar(
      @Param('coVaga', ParseIntPipe) id: number,
      @Req() request: Request,
    ): Promise<ResponseDto<null>> {
      await this.vagasService.deletarVaga(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Vaga deletada com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
      };
    }
    
    @Put(':coVaga')
    @ApiOperation({ summary: 'Alterna o status ativo/inativo da vaga' })
    @ApiParam({ name: 'coVaga', type: Number, description: 'ID da Vaga' })
    async alternarStatus(
      @Param('coVaga', ParseIntPipe) id: number,
      @Req() request: Request,
    ): Promise<ResponseDto<Vagas>> {
      const vagaAtualizada = await this.vagasService.alternarStatus(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Status da Vaga alternado com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: vagaAtualizada,
      };
    }
  }