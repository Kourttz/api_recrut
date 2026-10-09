import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Candidaturas } from './candidaturas.entity';
import { StatusAgendado } from '../status_agendado/status_agendado.entity';
import { HistoricoCandidatura } from '../historico_candidatura/historico_candidatura.entity';
import { KafkaService } from '../kafka/kafka.service';

// ✅ Tipagem do log
type CandidaturaProcessada = {
  coCandidatura: number;
  statusAnterior: number;
  statusNovo: number;
  dtStatus: Date;
};

@Injectable()
export class CandidaturasCronService {
  private readonly logger = new Logger(CandidaturasCronService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processarStatusAgendados() {
    this.logger.log('Iniciando varredura de status agendados vencidos...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const agora = new Date();

      const agendamentosVencidos = await queryRunner.manager
      .createQueryBuilder(StatusAgendado, 'sa')
      .innerJoinAndSelect('sa.candidatura', 'candidatura')
      .leftJoinAndSelect('candidatura.usuarioAtribuido', 'usuarioAtribuido')
      .leftJoinAndSelect('candidatura.vaga', 'vaga') 
      .leftJoinAndSelect('candidatura.funcaoCandidatura', 'fc') 
      .leftJoinAndSelect('fc.candidato', 'candidato') 
      .where('sa.dtStatus <= :agora', { agora })
      .andWhere('candidatura.coStatus = :statusAgendado', { statusAgendado: 29 })
      .getMany();

      if (agendamentosVencidos.length === 0) {
        this.logger.log('Nenhum status agendado vencido encontrado.');
        await queryRunner.release();
        return;
      }

      this.logger.log(`Processando ${agendamentosVencidos.length} candidaturas vencidas.`);

      // ✅ Tipado corretamente
      const candidaturasProcessadas: CandidaturaProcessada[] = [];

      for (const agendamento of agendamentosVencidos) {
        const coCandidatura = agendamento.coCandidatura;

        // Atualiza status
        await queryRunner.manager.update(
          Candidaturas,
          { coCandidatura },
          { coStatus: 1 }
        );

        // Histórico
        const novoHistorico = queryRunner.manager.create(HistoricoCandidatura, {
          coCandidatura,
          coUsuario: 440,
          noHistorico:
            'Status alterado automaticamente de "Agendado (ID: 29)" para "Novo (ID: 1)" devido ao vencimento da data estipulada.',
        });

        await queryRunner.manager.save(novoHistorico);

        // Remove agendamento
        await queryRunner.manager.delete(StatusAgendado, {
          coStatusAgendado: agendamento.coStatusAgendado,
        });

        // ✅ Adiciona para auditoria
        candidaturasProcessadas.push({
          coCandidatura,
          statusAnterior: 29,
          statusNovo: 1,
          dtStatus: agendamento.dtStatus,
        });

        const candidatura = agendamento.candidatura;
        const responsavel = candidatura.usuarioAtribuido;
        const candidato = candidatura.funcaoCandidatura?.candidato;
        const vaga = candidatura.vaga;

        if (responsavel && responsavel.coMatricula) {
          const nomeCandidato = candidato?.noCandidato || 'Não informado';
          const cpfCandidato = candidato?.coCpf || 'Não informado';
          const nomeVaga = vaga?.noVaga || 'Vaga não identificada';

          await this.kafkaService.emitirNotificacao({
            registration: responsavel.coMatricula,
            title: 'Agendamento Expirado',
            message: `O agendamento do candidato ${nomeCandidato} (CPF: ${cpfCandidato}) para a vaga "${nomeVaga}" expirou e o status foi reiniciado.`,
            priority: 'high',
            source: 'recrutamento_candidaturas_cron',
            is_ephemeral: false
          });
        }
      }

      await queryRunner.commitTransaction();

      // ✅ AUDITORIA SUCESSO
      await this.kafkaService.emitirAuditoria({
        no_sistema: 'Recrutamento',
        no_funcionalidade: 'candidaturas',
        no_perfil: 'Rotinas',
        tp_acao: 'ATUALIZAR',
        tx_endpoint: '/cron/candidaturas/status',
        nu_status_code: 200,
        co_usuario: 440,
        co_matricula: '000000',
        no_ip: '0.0.0.0',
        vl_dados_enviados: {
          total_processadas: candidaturasProcessadas.length,
        },
        vl_dados_recebidos: candidaturasProcessadas,
      });

      this.logger.log('Candidaturas atualizadas e auditadas com sucesso.');

    } catch (error) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // ❌ AUDITORIA ERRO
      await this.kafkaService.emitirAuditoria({
        no_sistema: 'Recrutamento',
        no_funcionalidade: 'candidaturas',
        no_perfil: 'Rotinas',
        tp_acao: 'ATUALIZAR',
        tx_endpoint: '/cron/candidaturas/status',
        nu_status_code: 500,
        co_usuario: 440,
        co_matricula: '000000',
        no_ip: '0.0.0.0',
        vl_dados_enviados: null,
        vl_dados_recebidos: {
          erro: errorMessage,
        },
      });

      this.logger.error('Erro ao executar a rotina de status agendados', errorMessage);

    } finally {
      await queryRunner.release();
    }
  }
}