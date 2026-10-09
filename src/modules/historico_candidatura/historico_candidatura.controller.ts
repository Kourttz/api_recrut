import {
    Controller, Get, HttpStatus, Req, Param, ParseIntPipe, UseFilters
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
  import { HistoricoCandidaturaService } from './historico_candidatura.service';
  import { HistoricoCandidatura } from './historico_candidatura.entity';
  import { ResponseDto } from '../../common/filters/response.dto';
  import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
  import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
  import { Request } from 'express';
  
  @ApiBearerAuth('access-token')
  @ApiTags('Histórico de Candidaturas')
  @UseFilters(HttpExceptionFilter)
  @Controller('hc') 
  export class HistoricoCandidaturaController {
    constructor(private readonly historicoService: HistoricoCandidaturaService) {}
  
    @Get()
    @ApiOperation({ summary: 'Lista todos os históricos com detalhes da candidatura' })
    async listar(@Req() request: Request): Promise<ResponseDto<HistoricoCandidatura[]>> {
      const dados = await this.historicoService.listarHistoricos();
      return {
        statusCode: HttpStatus.OK,
        message: 'Históricos listados com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: dados,
      };
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtém detalhes de um histórico específico' })
    @ApiParam({ name: 'id', type: Number })
    async obterPorId(
      @Param('id', ParseIntPipe) id: number,
      @Req() request: Request
    ): Promise<ResponseDto<HistoricoCandidatura>> {
      const dado = await this.historicoService.obterPorId(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Histórico obtido com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: dado,
      };
    }

    @Get('candidatura/:coCandidatura')
    @ApiOperation({ summary: 'Lista históricos por código da candidatura' })
    @ApiParam({ name: 'coCandidatura', type: Number })
    async listarPorCandidatura(
        @Param('coCandidatura', ParseIntPipe) coCandidatura: number,
        @Req() request: Request
    ): Promise<ResponseDto<HistoricoCandidatura[]>> {
        const dados = await this.historicoService.listarPorCandidatura(coCandidatura);
        return {
            statusCode: HttpStatus.OK,
            message: 'Histórico de candidatura obtido com sucesso',
            timestamp: getGMT3Timestamp(),
            path: request.url,
            data: dados
        };
    }

  }