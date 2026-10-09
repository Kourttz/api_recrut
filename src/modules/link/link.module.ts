import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkService } from './link.service';
import { Link } from './link.entity';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), AuthModule],
  providers: [LinkService],
  exports: [LinkService]
})
export class LinkModule {}
