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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  CriarFuncaoDto,
  AtualizarFuncaoDto,
} from './funcoes.dto';
import { FuncoesService } from './funcoes.service';
import { Funcoes } from './funcoes.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Funcoes')
@UseFilters(HttpExceptionFilter)
@Controller('funcoes')
export class FuncoesController {
  constructor(private readonly funcoesService: FuncoesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as Funções' })
  async listar(@Req() request: Request): Promise<ResponseDto<Funcoes[]>> {
    const funcoes = await this.funcoesService.listarFuncoes();
    return {
      statusCode: HttpStatus.OK,
      message: 'Funções listadas com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: funcoes,
    };
  }

  @Get(':coFuncao')
  @ApiOperation({ summary: 'Obtém uma Função pelo código' })
  @ApiParam({ name: 'coFuncao', type: Number, description: 'ID da Função a ser obtida' })
  async obterPorCodigo(@Req() request: Request, @Param('coFuncao') coFuncao: number): Promise<ResponseDto<Funcoes>> {
    const funcao = await this.funcoesService.obterFuncaoPorCodigo(coFuncao);
    return {
      statusCode: HttpStatus.OK,
      message: 'Função obtida com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: funcao,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova Função' })
  @ApiBody({
    type: CriarFuncaoDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação',
        value: { noFuncao: 'Função de teste', icSituacaoAtivo: true },
      },
    },
  })
  async criar(
    @Body() dados: CriarFuncaoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Funcoes>> {
    const funcao = await this.funcoesService.criarFuncao(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Função criada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: funcao,
    };
  }

  @Patch(':CoFuncao')
  @ApiOperation({ summary: 'Atualiza uma funcao existente' })
  @ApiBody({
    type: AtualizarFuncaoDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: { noFuncao: 'Função atualizada' },
      },
    },
  })
  @ApiParam({ name: 'coFuncao', type: Number, description: 'ID da Função' })
  async atualizar(
    @Param('coFuncao') id: number,
    @Body() dados: AtualizarFuncaoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Funcoes>> {
    const funcaoAtualizada = await this.funcoesService.atualizarFuncao(id, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Função atualizada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: funcaoAtualizada,
    };
  }

  @Delete(':coFuncao')
  @ApiOperation({ summary: 'Deleta uma funcao existente' })
  @ApiParam({ name: 'coFuncao', type: Number, description: 'ID da Função' })
  async deletar(
    @Param('coFuncao') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    await this.funcoesService.deletarFuncao(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Função deletada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }

  @Put(':coFuncao')
  @ApiOperation({ summary: 'Alterna o status ativo/inativo da funcao' })
  @ApiParam({ name: 'coFuncao', type: Number, description: 'ID da Função' })
  async alternarStatus(
    @Param('coFuncao') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<Funcoes>> {
    const funcaoAtualizada = await this.funcoesService.alternarStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status da Função alternado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: funcaoAtualizada,
    };
  }
}
