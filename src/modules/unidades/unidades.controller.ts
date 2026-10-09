import {
  Controller,
  Get,
  UseFilters,
  HttpStatus,
  Req,
  Param,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UnidadesService } from './unidades.service';
import { Unidades } from './unidades.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Unidades')
@UseFilters(HttpExceptionFilter)
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as Unidades' })
  async listar(@Req() request:Request): Promise<ResponseDto<Unidades[]>> {
    const unidades = await this.unidadesService.listarUnidades();
    return {
      statusCode: HttpStatus.OK,
      message: 'Unidades listadas com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: unidades
    };
  }

  @Get(':coUnidade')
  @ApiOperation({ summary: 'Obtém uma Unidade por ID' })
  async obterPorId(@Req() request: Request, @Param('coUnidade') id: number): Promise<ResponseDto<Unidades>> {
    const unidade = await this.unidadesService.obterUnidadePorId(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Unidades obtida com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: unidade,
    };
  }

}
