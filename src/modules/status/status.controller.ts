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
  CriarStatusDto,
  AtualizarStatusDto,
} from './status.dto';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Status')
@UseFilters(HttpExceptionFilter)
@Controller('status')
export class StatusController {
  constructor(private readonly acoesService: StatusService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os Status' })
  async listar(@Req() request: Request): Promise<ResponseDto<Status[]>> {
    const status = await this.acoesService.listarStatus();
    return {
      statusCode: HttpStatus.OK,
      message: 'Status listados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: status,
    };
  }

  @Get(':coStatus')
  @ApiOperation({ summary: 'Obtém um Status pelo código' })
  @ApiParam({ name: 'coStatus', type: Number, description: 'ID do Status a ser obtido' })
  async obterPorCodigo(@Req() request: Request, @Param('coStatus') coStatus: number): Promise<ResponseDto<Status>> {
    const status = await this.acoesService.obterStatusPorCodigo(coStatus);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status obtido com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: status,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo Status' })
  @ApiBody({
    type: CriarStatusDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação',
        value: { noStatus: 'Status de teste', icSituacaoAtivo: true },
      },
    },
  })
  async criar(
    @Body() dados: CriarStatusDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Status>> {
    const status = await this.acoesService.criarStatus(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Status criado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: status,
    };
  }

  @Patch(':CoStatus')
  @ApiOperation({ summary: 'Atualiza um status existente' })
  @ApiBody({
    type: AtualizarStatusDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: { noStatus: 'Status atualizada' },
      },
    },
  })
  @ApiParam({ name: 'coStatus', type: Number, description: 'ID da Status' })
  async atualizar(
    @Param('coStatus') id: number,
    @Body() dados: AtualizarStatusDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Status>> {
    const statusAtualizado = await this.acoesService.atualizarStatus(id, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status atualizado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: statusAtualizado,
    };
  }

  @Delete(':coStatus')
  @ApiOperation({ summary: 'Deleta um status existente' })
  @ApiParam({ name: 'coStatus', type: Number, description: 'ID da Status' })
  async deletar(
    @Param('coStatus') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    await this.acoesService.deletarStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status deletado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }

  @Put(':coStatus')
  @ApiOperation({ summary: 'Alterna o status ativo/inativo da status' })
  @ApiParam({ name: 'coStatus', type: Number, description: 'ID da Status' })
  async alternarStatus(
    @Param('coStatus') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<Status>> {
    const statusAtualizado = await this.acoesService.alternarStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status do Status alternado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: statusAtualizado,
    };
  }
}
