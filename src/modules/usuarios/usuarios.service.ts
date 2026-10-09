import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './usuarios.entity';



@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly UsuariosRepository: Repository<Usuarios>,
  ) {}

  /**
   * 
   * @returns Lista todos os usuários com seus perfis associados
   */
  async listarUsuarios(): Promise<Usuarios[]> {
    return this.UsuariosRepository.find();
  }

  /**
   * @param matricula Matrícula do usuário a ser buscado
   * @return Usuário encontrado ou null se não existir
   */
  async findByMatricula(matricula: string): Promise<Usuarios | null> {
    const usuario = await this.UsuariosRepository.findOneBy({ coMatricula: matricula });

    return usuario || null;
  }

  /**
   * 
   * @param id ID do usuário a ser obtido
   * @returns 
   */
  async obterUsuarioPorId(id: number): Promise<Usuarios> {
    
    const usuario = await this.UsuariosRepository.findOneBy({ coUsuario: id });

    /* Verifica se o usuário foi encontrado */
    if (!usuario) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return usuario;
  }

  /* FUNÇÕES DIRECIONADAS AO KAFKA */

  async create(data: any): Promise<void> {
    await this.UsuariosRepository.save(data);
    console.log(`🆕 Usuário criado: ${data.co_usuario}`);
  }

  async update(id: number, data: any): Promise<void> {
    await this.UsuariosRepository.save({ coUsuario: id }, data);
    console.log(`✏️ Usuário atualizado: ${id}`);
  }

  async delete(id: number): Promise<void> {
    await this.UsuariosRepository.delete({ coUsuario: id });
    console.log(`🗑️ Usuário deletado: ${id}`);
  }
 
}
