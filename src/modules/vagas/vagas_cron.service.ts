import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Vagas } from './vagas.entity';
import { KafkaService } from '../kafka/kafka.service';

// ✅ Tipagem forte do que será enviado na auditoria
type VagaProcessada = {
  coVaga: number;
  noVaga: string;
  dtEncerramento: Date;
};

@Injectable()
export class VagasCronService {
  private readonly logger = new Logger(VagasCronService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processarVagasEncerradas() {
    this.logger.log('Iniciando varredura de vagas vencidas...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const vagasVencidas = await queryRunner.manager
        .createQueryBuilder(Vagas, 'vaga')
        .leftJoinAndSelect('vaga.usuarioCadastro', 'usuarioCadastro')
        .where('vaga.dtEncerramento < :hoje', { hoje })
        .andWhere('vaga.icSituacaoAtivo = true')
        .getMany();

      if (vagasVencidas.length === 0) {
        this.logger.log('Nenhuma vaga vencida encontrada.');
        await queryRunner.release();
        return;
      }

      this.logger.log(`Processando ${vagasVencidas.length} vagas vencidas.`);

      // ✅ TIPADO CORRETAMENTE (resolve seu erro)
      const vagasProcessadas: VagaProcessada[] = [];

      for (const vaga of vagasVencidas) {
        
        await queryRunner.manager.update(
          Vagas,
          { coVaga: vaga.coVaga },
          { icSituacaoAtivo: false }
        );

        vagasProcessadas.push({
          coVaga: vaga.coVaga,
          noVaga: vaga.noVaga,
          dtEncerramento: vaga.dtEncerramento,
        });

        if (vaga.usuarioCadastro && vaga.usuarioCadastro.coMatricula) {
          await this.kafkaService.emitirNotificacao({
            registration: vaga.usuarioCadastro.coMatricula,
            title: 'Vaga Encerrada',
            message: `A vaga ID("${vaga.coVaga}") "${vaga.noVaga}" foi encerrada automaticamente por atingir a data de encerramento.`,
            priority: 'low',
            source: 'recrutamento_vagas_cron'
          });
        }
      }

      await queryRunner.commitTransaction();

      // ✅ AUDITORIA VIA KAFKA
      await this.kafkaService.emitirAuditoria({
        no_sistema: 'Recrutamento',
        no_funcionalidade: 'vagas',
        no_perfil: 'Rotinas',
        tp_acao: 'ATUALIZAR',
        tx_endpoint: '/cron/vagas/encerramento',
        nu_status_code: 200,
        co_usuario: 440,
        co_matricula: '000000',
        no_ip: '0.0.0.0',
        vl_dados_enviados: {
          total_processadas: vagasProcessadas.length,
        },
        vl_dados_recebidos: vagasProcessadas,
      });

      this.logger.log('Vagas atualizadas e auditadas com sucesso.');

    } catch (error) {
      await queryRunner.rollbackTransaction();

      // ✅ TRATAMENTO DE ERRO SEGURO
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // ❌ AUDITORIA DE ERRO
      await this.kafkaService.emitirAuditoria({
        no_sistema: 'Recrutamento',
        no_funcionalidade: 'vagas',
        no_perfil: 'Rotinas',
        tp_acao: 'ATUALIZAR',
        tx_endpoint: '/cron/vagas/encerramento',
        nu_status_code: 500,
        co_usuario: 440,
        co_matricula: '000000',
        no_ip: '0.0.0.0',
        vl_dados_enviados: null,
        vl_dados_recebidos: {
          erro: errorMessage,
        },
      });

      this.logger.error('Erro ao executar rotina de vagas', errorMessage);

    } finally {
      await queryRunner.release();
    }
  }
}