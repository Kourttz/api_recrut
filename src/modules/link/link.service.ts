import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity'; 

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.linkRepository.insert(data);
    console.log(`🆕 Link criado: ${data.coLink}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.linkRepository.update({ coLink: id }, data);
    console.log(`✏️ Link atualizado: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.linkRepository.delete({ coLink: id });
    console.log(`🗑️ Link deletado: ${id}`);
  }
}