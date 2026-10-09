import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificacao } from './certificacao.entity'; 

@Injectable()
export class CertificacaoService {
  constructor(
    @InjectRepository(Certificacao)
    private readonly certificacaoRepository: Repository<Certificacao>,
  ) {}

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.certificacaoRepository.insert(data);
    console.log(`🆕 Certificação criada: ${data.coCertificacao}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.certificacaoRepository.update({ coCertificacao: id }, data);
    console.log(`✏️ Certificação atualizada: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.certificacaoRepository.delete({ coCertificacao: id });
    console.log(`🗑️ Certificação deletada: ${id}`);
  }
}