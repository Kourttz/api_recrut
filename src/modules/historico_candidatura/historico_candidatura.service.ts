import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricoCandidatura } from './historico_candidatura.entity';

@Injectable()
export class HistoricoCandidaturaService {
  constructor(
    @InjectRepository(HistoricoCandidatura)
    private readonly historicoRepository: Repository<HistoricoCandidatura>,
  ) {}

  // Definição dos relacionamentos para carregar os dados completos
  private readonly relations = [
    'usuario', 
    'candidatura',
    'candidatura.vaga',
    'candidatura.funcaoCandidatura',
    'candidatura.funcaoCandidatura.candidato', 
    'candidatura.status'
  ];

  async listarHistoricos(): Promise<HistoricoCandidatura[]> {
    return this.historicoRepository.find({
      relations: this.relations,
      order: { dtRegistro: 'DESC' },
    });
  }

  async obterPorId(id: number): Promise<HistoricoCandidatura> {
    const historico = await this.historicoRepository.findOne({
      where: { coHistoricoCandidatura: id },
      relations: this.relations,
    });

    if (!historico) {
      throw new HttpException(
        `Histórico com código ${id} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return historico;
  }

  async listarPorCandidatura(coCandidatura: number): Promise<HistoricoCandidatura[]> {
    return this.historicoRepository.find({
      where: { coCandidatura },
      relations: this.relations,
      order: { dtRegistro: 'DESC' },
    });
  }
}