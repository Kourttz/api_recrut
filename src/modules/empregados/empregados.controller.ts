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
  import { EmpregadosService } from './empregados.service';
  import { Empregado } from './entities/empregado.entity';
  import { ResponseDto } from '../../common/filters/response.dto';
  import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
  import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
  import { Request } from 'express';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiBearerAuth('access-token')
  @ApiTags('Empregados')
  @UseFilters(HttpExceptionFilter)
  @Controller('empregados')
  export class EmpregadosController {
    constructor(private readonly empregadosService: EmpregadosService) {}
    
    @Get()
    @ApiOperation({ summary: 'Lista todos os Empregados' })
    async listar(@Req() request:Request): Promise<ResponseDto<Empregado[]>> {
      const empregados = await this.empregadosService.listarEmpregados();
      return {
        statusCode: HttpStatus.OK,
        message: 'Empregados listados com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: empregados
      };
    }
    
    @Get(':coEmpregado')
    @ApiOperation({ summary: 'Obtém um Empregado por ID' })
    async obterPorId(@Req() request: Request, @Param('coEmpregado') id: string): Promise<ResponseDto<Empregado>> {
      const empregado = await this.empregadosService.obterEmpregadoPorId(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Empregado obtido com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: empregado,
      };
    }
  
  }
  