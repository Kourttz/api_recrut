import { Module, forwardRef } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './usuarios.entity';
import { AuthModule } from '../../common/auth/auth.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios]), forwardRef(() => AuthModule), TokenModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], 
})
export class UsuariosModule {}
