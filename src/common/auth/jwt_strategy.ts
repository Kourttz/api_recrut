import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Usuarios } from '../../modules/usuarios/usuarios.entity';
import { UsuariosService } from '../../modules/usuarios/usuarios.service';
import { TokenService } from '../../modules/token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usuariosService: UsuariosService,
  ) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        'Segredo JWT (JWT_SECRET) não encontrado nas variáveis de ambiente.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any): Promise<Usuarios> {
    if (!payload || !payload.registration) {
      throw new UnauthorizedException('Payload do token inválido.');
    }
  
    // 1. Mantenha como string, pois o service espera string
    const matricula = String(payload.registration);
  
    // 2. Busca o usuário (findByMatricula espera string)
    const user = await this.usuariosService.findByMatricula(matricula);
  
    // 3. Verifica se existe e se icSituacaoAtivo é verdadeiro
    if (!user || user.icSituacaoAtivo === false) {
      throw new UnauthorizedException('Token inválido ou usuário desativado.');
    }
  
    // O NestJS anexará este objeto 'user' em request.user
    return user;
  }
}
