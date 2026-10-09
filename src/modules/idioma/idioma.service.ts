import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idioma } from './idioma.entity';

@Injectable()
export class IdiomaService {
  constructor(
    @InjectRepository(Idioma)
    private readonly idiomaRepository: Repository<Idioma>,
  ) {}
  /**
   *
   * @returns Lista todos os idioma
   */
  async listarIdioma(): Promise<Idioma[]> {
    return this.idiomaRepository.find();
  }

  /**
   * 
   * @param id ID do idioma a ser obtido
   * @returns Obtém um idioma pelo seu código
   */
  async obterIdiomaPorCodigo(id: number): Promise<Idioma> {
    const idioma = await this.idiomaRepository.findOneBy({ coIdioma: id });

    if (!idioma) {
      throw new HttpException(
        `Idioma com código ${id} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return idioma;
  }

  /**
   * 
   * @param dados Dados para criar um novo idioma
   * @returns
   */
  async criarIdioma(dados: Partial<Idioma>): Promise<Idioma> {

    /* Verifica se o campo coIdioma foi fornecido */
    if (dados.coIdioma) {
      throw new HttpException(
        'Não é permitido informar um ID (coIdioma) para o novo idioma',
        HttpStatus.BAD_REQUEST,
      );
    }

    const idioma = this.idiomaRepository.create(dados);
    return await this.idiomaRepository.save(idioma);
  }

  async atualizarIdioma(id: number, dados: Partial<Idioma>): Promise<Idioma> {

    const resultado = await this.idiomaRepository.update(id, dados);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Idioma não encontrado para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const idiomaAtualizado = await this.idiomaRepository.findOneBy({ coIdioma: id });

    /* Verifica se o idioma atualizado foi recuperado com sucesso */
    if (!idiomaAtualizado) {
      throw new HttpException(
        'Erro ao recuperar idioma após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return idiomaAtualizado;
  }

  /**
   * 
   * @param id ID do idioma a ser deletado
   * @return
   */
  async deletarIdioma(id: number): Promise<void> {

    const resultado = await this.idiomaRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Idioma não encontrado para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

}
