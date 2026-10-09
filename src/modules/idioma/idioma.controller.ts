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
    UseGuards
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
  import {
    CriarIdiomaDto,
    AtualizarIdiomaDto,
  } from './idioma.dto';
  import { IdiomaService } from './idioma.service';
  import { Idioma } from './idioma.entity';
  import { ResponseDto } from '../../common/filters/response.dto';
  import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
  import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
  import { Request } from 'express';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiBearerAuth('access-token')
  @ApiTags('Idioma')
  @UseFilters(HttpExceptionFilter)
  @Controller('idioma')
  export class IdiomaController {
    constructor(private readonly idiomaService: IdiomaService) {}
    
    @Get()
    @ApiOperation({ summary: 'Lista todos os Idioma' })
    async listar(@Req() request: Request): Promise<ResponseDto<Idioma[]>> {
      const idioma = await this.idiomaService.listarIdioma();
      return {
        statusCode: HttpStatus.OK,
        message: 'Idioma listados com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: idioma,
      };
    }
    
    @Get(':coIdioma')
    @ApiOperation({ summary: 'Obtém um Idioma pelo código' })
    @ApiParam({ name: 'coIdioma', type: Number, description: 'ID do Idioma a ser obtido' })
    async obterPorCodigo(@Req() request: Request, @Param('coIdioma') coIdioma: number): Promise<ResponseDto<Idioma>> {
      const idioma = await this.idiomaService.obterIdiomaPorCodigo(coIdioma);
      return {
        statusCode: HttpStatus.OK,
        message: 'Idioma obtido com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: idioma,
      };
    }
    
    @Post()
    @ApiOperation({ summary: 'Cria um novo Idioma' })
    @ApiBody({
      type: CriarIdiomaDto,
      examples: {
        exemplo: {
          summary: 'Exemplo de criação',
          value: { noIdioma: 'Idioma de teste', icSituacaoAtivo: true },
        },
      },
    })
    async criar(
      @Body() dados: CriarIdiomaDto,
      @Req() request: Request,
    ): Promise<ResponseDto<Idioma>> {
      const idioma = await this.idiomaService.criarIdioma(dados);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Idioma criado com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: idioma,
      };
    }
    
    @Patch(':coIdioma')
    @ApiOperation({ summary: 'Atualiza um idioma existente' })
    @ApiBody({
      type: AtualizarIdiomaDto,
      examples: {
        exemplo: {
          summary: 'Exemplo de atualização',
          value: { noIdioma: 'Idioma atualizado' },
        },
      },
    })
    @ApiParam({ name: 'coIdioma', type: Number, description: 'ID do Idioma' })
    async atualizar(
      @Param('coIdioma') id: number,
      @Body() dados: AtualizarIdiomaDto,
      @Req() request: Request,
    ): Promise<ResponseDto<Idioma>> {
      const idiomaAtualizado = await this.idiomaService.atualizarIdioma(id, dados);
      return {
        statusCode: HttpStatus.OK,
        message: 'Idioma atualizado com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: idiomaAtualizado,
      };
    }
    
    @Delete(':coIdioma')
    @ApiOperation({ summary: 'Deleta um idioma existente' })
    @ApiParam({ name: 'coIdioma', type: Number, description: 'ID do Idioma' })
    async deletar(
      @Param('coIdioma') id: number,
      @Req() request: Request,
    ): Promise<ResponseDto<null>> {
      await this.idiomaService.deletarIdioma(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Idioma deletado com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
      };
    }
  
  }
  