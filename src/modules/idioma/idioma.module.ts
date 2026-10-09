import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdiomaController } from './idioma.controller';
import { IdiomaService } from './idioma.service';
import { Idioma } from './idioma.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Idioma]), AuthModule],
  controllers: [IdiomaController],
  providers: [IdiomaService],
  exports: [IdiomaService],
})
export class IdiomaModule {}
