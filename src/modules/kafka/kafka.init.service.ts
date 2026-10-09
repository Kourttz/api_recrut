import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class KafkaInitService implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    console.log('🚀 Iniciando criação automática dos conectores Debezium para o Recrutamento...');

    const connectors = [
      // ========== TABELAS PRINCIPAIS ==========
      {
        connectorName: 'pg-connector-funcoes',
        schema: 'public',
        table: 'tb_funcoes',
        topicPrefix: 'recrutamento_funcoes',
      },
      {
        connectorName: 'pg-connector-vagas',
        schema: 'public',
        table: 'tb_vagas',
        topicPrefix: 'recrutamento_vagas',
      },
      
    ];

    for (const cfg of connectors) {
      try {
        console.log(`⚙️ Criando conector: ${cfg.connectorName} → ${cfg.topicPrefix}_topic`);
        await this.kafkaService.criarConnector(cfg);
      } catch (err) {
        console.error(`❌ Erro ao criar connector ${cfg.connectorName}:`, err.message);
      }
    }

    console.log('✅ Todos os conectores do Recrutamento foram inicializados com sucesso!');
  }
}
