import { Module, forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vagas } from './vagas.entity';
import { VagasService } from './vagas.service';
import { VagasController } from './vagas.controller';
import { AuthModule } from '../../common/auth/auth.module';
import { KafkaModule } from '../kafka/kafka.module';
import { VagasCronService } from './vagas_cron.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vagas]), 
        AuthModule, 
        forwardRef(() => KafkaModule)
    ],
    controllers: [VagasController],
    providers: [VagasService, VagasCronService],
    exports: [VagasService, VagasCronService],
})
export class VagasModule { }