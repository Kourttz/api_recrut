import { Kafka } from 'kafkajs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConnectorConfig } from './utils/connector.interface';
import { DebeziumDateUtil } from './utils/debezium-date.util';
import { createDebeziumConnector } from './utils/kafka.connector';
import { v4 as uuidv4 } from 'uuid';
import { LinkService } from '../link/link.service'; 
import { SkillService } from '../skill/skill.service';
import { IdiomaService } from '../idioma/idioma.service'; 
import { ProjetoService } from '../projeto/projeto.service';
import { UnidadesService } from '../unidades/unidades.service';
import { EducacaoService } from '../educacao/educacao.service'; 
import { UsuariosService } from '../usuarios/usuarios.service';
import { EmpregadosService } from '../empregados/empregados.service';
import { CandidatosService } from '../candidatos/candidatos.service';
import { ExperienciaService } from '../experiencia/experiencia.service'; 
import { CandidaturasService } from '../candidaturas/candidaturas.service';
import { CertificacaoService } from '../certificacao/certificacao.service'; 
import { CandidatoSkillService } from '../candidato_skill/candidato_skill.service';


@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly unidadesService: UnidadesService,
    private readonly empregadosService: EmpregadosService,
    private readonly candidatosService: CandidatosService,
    
    // Injeção dos serviços filhos    
    private readonly LinkService: LinkService,
    private readonly SkillService: SkillService,
    private readonly IdiomaService: IdiomaService,
    private readonly ProjetoService: ProjetoService,
    private readonly educacoesService: EducacaoService,
    private readonly experienciasService: ExperienciaService,
    private readonly CertificacaoService: CertificacaoService,
    private readonly CandidaturasService: CandidaturasService,
    private readonly candidatoSkillService: CandidatoSkillService, 
  ) {}

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'api_recrutamento',
      brokers: ['kafka:29092'],
    });
    
    this.producer = this.kafka.producer(); 
    await this.producer.connect();

    const consumer = this.kafka.consumer({ groupId: 'recrutamento-consumer' });
    await consumer.connect();

    // ==================================================================
    // 1. INSCRIÇÃO NOS TÓPICOS 
    // ==================================================================
    const topics = [
      'empregados_plansul_topic',
      'empregado_cadastrado_topic',
      'gestao_usuarios_topic',
      'gestao_unidades_topic',
      'recrutamento_candidatos_topic',
      // 'recrutamento_experiencia_topic',
      // 'recrutamento_educacao_topic',
      // 'recrutamento_skill_topic',
      // 'recrutamento_candidato_skill_topic',
      // 'recrutamento_certificacao_topic',
      // 'recrutamento_idioma_topic',
      // 'recrutamento_projeto_topic',
      // 'recrutamento_link_topic',
      'recrutamento_candidaturas_topic',
    ];

    await consumer.subscribe({ topics: topics, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;

        try {
          const event = JSON.parse(message.value.toString());
          const payload = event?.payload;
          if (!payload) return;

          const op = payload.op;
          const after = payload.after;
          const before = payload.before;

          console.log(`📥 [${topic}] Mensagem recebida - op: ${op}`);

          // ==================================================================
          // 2. ROTEAMENTO E TRATAMENTO DE EVENTOS
          // ==================================================================
          switch (topic) {
             // --- SC_BASES: EMPREGADOS ---
             case 'empregados_plansul_topic':
             case 'empregado_cadastrado_topic':
              await this.tratarEvento(
                this.empregadosService,
                before,
                after,
                op,
                'id_empregado',
                this.mapearEmpregado,
              );
              break;

            // --- GESTÃO: USUÁRIOS ---
            case 'gestao_usuarios_topic':
              await this.tratarEvento(
                this.usuariosService,
                before,
                after,
                op,
                'co_usuario',
                this.mapearUsuario,
              );
              break;
            
            // --- GESTÃO: UNIDADES ---
            case 'gestao_unidades_topic':
              await this.tratarEvento(
                this.unidadesService,
                before,
                after,
                op,
                'co_unidade',
                this.mapearUnidade,
              );
              break;

            // --- RECRUTAMENTO: CANDIDATOS (LÓGICA CUSTOMIZADA UPSERT) ---
            case 'recrutamento_candidatos_topic':
              const dadosCandidato = after ? this.mapearCandidato(after) : null;
              
              if (dadosCandidato) {
                 // IGNORA O 'op' (c, u, r) E CHAMA O PROCESSADOR INTELIGENTE
                 await this.candidatosService.processarMensagemKafka(dadosCandidato);
              } else if (op === 'd' && before) {
                 // Para delete, ainda tentamos pelo ID antigo (ou implemente busca por CPF se preferir)
                 await this.candidatosService.delete(before.co_candidato);
              }
              break;

            // // --- RECRUTAMENTO: EXPERIÊNCIA ---
            // case 'recrutamento_experiencia_topic':
            //   await this.tratarEvento(
            //     this.experienciasService,
            //     before,
            //     after,
            //     op,
            //     'co_experiencia',
            //     this.mapearExperiencia,
            //   );
            //   break;

            // // --- RECRUTAMENTO: EDUCAÇÃO ---
            // case 'recrutamento_educacao_topic':
            //   await this.tratarEvento(
            //     this.educacoesService,
            //     before,
            //     after,
            //     op,
            //     'co_educacao',
            //     this.mapearEducacao,
            //   );
            //   break;

            // // --- RECRUTAMENTO: SKILL ---
            // case 'recrutamento_skill_topic':
            //   await this.tratarEvento(
            //     this.SkillService,
            //     before,
            //     after,
            //     op,
            //     'co_skill',
            //     this.mapearSkill,
            //   );
            //   break;

            // // --- RECRUTAMENTO: CANDIDATO SKILL ---
            // case 'recrutamento_candidato_skill_topic':
            //   await this.tratarEvento(this.candidatoSkillService,
            //     before,
            //     after,
            //     op,
            //     'co_candidato_skill',
            //     this.mapearCandidatoSkill
            //   );
            //   break;

            // // --- RECRUTAMENTO: CERTIFICAÇÃO ---
            // case 'recrutamento_certificacao_topic':
            //   await this.tratarEvento(
            //     this.CertificacaoService,
            //     before,
            //     after,
            //     op,
            //     'co_certificacao',
            //     this.mapearCertificacao,
            //   );
            //   break;

            // // --- RECRUTAMENTO: IDIOMA ---
            // case 'recrutamento_idioma_topic':
            //   await this.tratarEvento(
            //     this.IdiomaService,
            //     before,
            //     after,
            //     op,
            //     'co_idioma',
            //     this.mapearIdioma,
            //   );
            //   break;

            // // --- RECRUTAMENTO: PROJETO ---
            // case 'recrutamento_projeto_topic':
            //   await this.tratarEvento(
            //     this.ProjetoService,
            //     before,
            //     after,
            //     op,
            //     'co_projeto',
            //     this.mapearProjeto,
            //   );
            //   break;

            // // --- RECRUTAMENTO: LINK ---
            // case 'recrutamento_link_topic':
            //   await this.tratarEvento(
            //     this.LinkService,
            //     before,
            //     after,
            //     op,
            //     'co_link',
            //     this.mapearLink,
            //   );
            //   break;

            // --- RECRUTAMENTO: CANDIDATURAS ---
             case 'recrutamento_candidaturas_topic':
              const dadosCandidatura = after ? this.mapearCandidatura(after) : null;
  
              if (dadosCandidatura) {
                // Chamamos um método específico para lidar com a lógica de CPF -> Candidato -> Função
                await this.CandidaturasService.processarMensagemKafka(dadosCandidatura);
              } else if (op === 'd' && before) {
                // Lógica de deleção se necessário
                await this.CandidaturasService.deletarCandidatura(before.co_candidatura);
              }
              break;

            default:
              console.warn(`⚠️ Tópico não tratado no switch: ${topic}`);
              break;
          }
        } catch (err) {
          console.error(`❌ Erro ao processar mensagem do tópico ${topic}:`, err);
        }
      },
    });
  }

  // ==================================================================
  // 3. FUNÇÃO GENÉRICA DE TRATAMENTO (CRUD)
  // ==================================================================
  private async tratarEvento(
    service: any,
    before: any,
    after: any,
    op: string,
    idField: string,
    mapFn: (data: any) => any,
  ) {
    const mappedData = after ? mapFn(after) : null;

    try {
      switch (op) {
        case 'c': // Create
        case 'r': // Read (Snapshot)
          if (!after?.[idField]) return;
          console.log(`🟢 [${service.constructor.name}] Criando registro (${idField}: ${after[idField]})`);
          if (service.create) await service.create(mappedData);
          break;

        case 'u': // Update
          if (!after?.[idField]) return;
          console.log(`🟡 [${service.constructor.name}] Atualizando registro (${idField}: ${after[idField]})`);
          if (service.update) await service.update(after[idField], mappedData);
          break;

        case 'd': // Delete
          if (!before?.[idField]) return;
          console.log(`🔴 [${service.constructor.name}] Deletando registro (${idField}: ${before[idField]})`);
          if (service.delete) await service.delete(before[idField]);
          break;
      }
    } catch (error) {
      console.error(`❌ Erro no serviço ${service.constructor.name} (Op: ${op}):`, error.message);
    }
  }

  // ==================================================================
  // 4. MAPEADORES DE DADOS (Snake_case -> CamelCase)
  // ==================================================================
  private mapearEmpregado(data: any) {
    return {
       // PK
       id_empregado: data.id_empregado,

       // Identificação
       co_matricula: data.co_matricula,
       co_matricula_cliente: data.co_matricula_cliente,
 
       // Dados pessoais
       no_nome: data.no_nome,
       co_cpf: data.co_cpf,
       no_nome_social: data.no_nome_social,
       ds_sexo: data.ds_sexo,
 
       // Função / hierarquia
       co_funcao: data.co_funcao,
       co_matricula_gestor_cliente: data.co_matricula_gestor_cliente,
       co_matricula_gestor_plansul: data.co_matricula_gestor_plansul,
       co_matricula_monitor_plansul: data.co_matricula_monitor_plansul,
       co_matricula_alteracao_plansul: data.co_matricula_alteracao_plansul,
 
       // Contato
       nu_telefone: data.nu_telefone,
       nu_telefone2: data.nu_telefone2,
 
       // Certificação / dados adicionais
       nu_certificado: data.nu_certificado,
       ds_dados_adicionais: data.ds_dados_adicionais,
 
       // Dados administrativos
       nu_pis: data.nu_pis,
       nu_filial: data.nu_filial,
       id_situacao: data.id_situacao,
       ds_situacao: data.ds_situacao,
 
       // Localização
       co_bairro: data.co_bairro,
       co_municipio: data.co_municipio,
       co_local_trabalho: data.co_local_trabalho,
 
       // Datas (Debezium → Date)
       dt_funcao: DebeziumDateUtil.convertEpochDays(data.dt_funcao),
       dt_nascimento: DebeziumDateUtil.convertEpochDays(data.dt_nascimento),
       dt_admissao: DebeziumDateUtil.convertEpochDays(data.dt_admissao),
       dt_demissao: DebeziumDateUtil.convertEpochDays(data.dt_demissao),
       dt_situacao: DebeziumDateUtil.convertEpochDays(data.dt_situacao),
       dt_hist_alteracao: DebeziumDateUtil.convertEpochDays(data.dt_hist_alteracao),
 
       // Timestamp (micros/nanos → Date)
       dt_alteracao: DebeziumDateUtil.convertNanoTimestamp(data.dt_alteracao),
 
       // Horários (nanos → HH:mm:ss)
       hr_jornada_entrada: DebeziumDateUtil.convertNanoToTime(data.hr_jornada_entrada),
       hr_jornada_saida: DebeziumDateUtil.convertNanoToTime(data.hr_jornada_saida),
       hr_descanso1: DebeziumDateUtil.convertNanoToTime(data.hr_descanso1),
       hr_descanso2: DebeziumDateUtil.convertNanoToTime(data.hr_descanso2),
       hr_lanche: DebeziumDateUtil.convertNanoToTime(data.hr_lanche),
 
       // Boolean
       ic_certificado_digital:
         data.ic_certificado_digital === null
           ? null
           : Boolean(data.ic_certificado_digital),
    };
  }

  private mapearUsuario(data: any) {
    return {
      coUsuario: data.co_usuario,
      noName: data.no_name,
      coMatricula: data.co_matricula,
      noEmail: data.no_email,
      icSituacaoAtivo: data.ic_situacao_ativo ?? true,
      coPerfil: data.co_perfil,
      nuFilial: data.nu_filial,
    };
  }

  private mapearUnidade(data: any) {
    return {
      coUnidade: data.co_unidade,
      nuFilial: data.nu_filial,
      noProjeto: data.no_projeto,
      nuContrato: data.nu_contrato,
      dtInicio: data.dt_inicio,
      dtFim: data.dt_fim,
      nuCnpj: data.nu_cnpj,
      noRazaoSocial: data.no_razao_social,
      noEndereco: data.no_endereco,
      noMunicipio: data.no_municipio,
      noUnidadeFederativa: data.no_unidade_federativa,
      coUsuarioGerente: data.co_usuario_gerente,
      icSituacaoAtivo: data.ic_situacao_ativo ?? true,
    }
  };

  private mapearCandidato(data: any) {
    const candidato = {
      coCandidato: data.co_candidato,
      noCandidato: data.no_candidato,
      headline: data.headline,
      resumo: data.resumo,
      noEmail: data.no_email,
      nuTelefone: data.nu_telefone,
      dtNascimento: data.dt_nascimento, 
      noLocalizacao: data.no_localizacao,
      urlFoto: data.url_foto,
      urlCurriculo: data.url_curriculo,
      urlLinkedin: data.url_linkedin,
      urlPortfolio: data.url_portfolio,
      coCpf: data.co_cpf ? String(data.co_cpf) : null,
      dtCriadoEm: data.dt_criado_em,
      dtAtualizadoEm: data.dt_atualizado_em
    };

    const experiencias = data.experiencias?.map((exp: any) => ({
      noCargo: exp.no_cargo,
      noEmpresa: exp.no_empresa,
      tpEmprego: exp.tp_emprego,
      noLocalizacao: exp.no_localizacao,
      icAtual: Boolean(exp.ic_atual),
      dtInicio: exp.dt_inicio, 
      dtFim: exp.dt_fim,
      deDescricao: exp.de_descricao
    })) || [];

    const educacoes = data.educacoes?.map((edu: any) => ({
      noInstituicao: edu.no_instituicao,
      noCurso: edu.no_curso,
      noNivel: edu.no_nivel,
      dtInicio: edu.dt_inicio,
      dtFim: edu.dt_fim,
      deDescricao: edu.de_descricao,
      noStatus: edu.no_status
    })) || [];

    const certificacoes = data.certificacoes?.map((cert: any) => ({
      noCertificacao: cert.no_certificacao,
      noInstituicao: cert.no_instituicao,
      urlCertificado: cert.url_certificado,
      dtEmissao: cert.dt_emissao,
      dtValidade: cert.dt_validade
    })) || [];

    const idiomas = data.idiomas?.map((idi: any) => ({
      noIdioma: idi.no_idioma,
      noNivel: idi.no_nivel
    })) || [];

    const projetos = data.projetos?.map((proj: any) => ({
      noProjeto: proj.no_projeto,
      deDescricao: proj.de_descricao,
      urlProjeto: proj.url_projeto,
      dtInicio: proj.dt_inicio,
      dtFim: proj.dt_fim
    })) || [];

    const links = data.links?.map((lnk: any) => ({
      noTitulo: lnk.no_titulo,
      urlLink: lnk.url_link
    })) || [];

    const skills = data.skills?.map((skill: any) => ({
      noSkill: skill.no_skill, 
      nuNivel: skill.nu_nivel,
      coSkill: skill.co_skill 
    })) || [];

    return {
      ...candidato,
      experiencias,
      educacoes,
      certificacoes,
      idiomas,
      projetos,
      links,
      skills, 
    };
  }

  private mapearExperiencia(data: any) {
    return {
      coExperiencia: data.co_experiencia,
      coCandidato: data.co_candidato,
      noCargo: data.no_cargo,
      noEmpresa: data.no_empresa,
      tpEmprego: data.tp_emprego,
      noLocalizacao: data.no_localizacao,
      icAtual: Boolean(data.ic_atual),
      dtInicio: data.dt_inicio,
      dtFim: data.dt_fim,
      deDescricao: data.de_descricao,
    };
  }

  private mapearEducacao(data: any) {
    return {
      coEducacao: data.co_educacao,
      coCandidato: data.co_candidato,
      noInstituicao: data.no_instituicao,
      noCurso: data.no_curso,
      noNivel: data.no_nivel,
      dtInicio: data.dt_inicio,
      dtFim: data.dt_fim,
      deDescricao: data.de_descricao,
    };
  }

  private mapearSkill(data: any) {
    return {
      coSkill: data.co_skill,
      noSkill: data.no_skill,
    };
  }

  private mapearCandidatoSkill(data: any) {
    return {
      coCandidatoSkill: data.co_candidato_skill,
      coCandidato: data.co_candidato,
      coSkill: data.co_skill,
      nuNivel: data.nu_nivel,
    };
  }

  private mapearCertificacao(data: any) {
    return {
      coCertificacao: data.co_certificacao,
      coCandidato: data.co_candidato,
      noCertificacao: data.no_certificacao,
      noInstituicao: data.no_instituicao,
      urlCertificado: data.url_certificado,
      dtEmissao: data.dt_emissao,
      dtValidade: data.dt_validade,
    };
  }

  private mapearIdioma(data: any) {
    return {
      coIdioma: data.co_idioma,
      noIdioma: data.no_idioma,
    };
  }

  private mapearProjeto(data: any) {
    return {
      coProjeto: data.co_projeto,
      coCandidato: data.co_candidato,
      noProjeto: data.no_projeto,
      deDescricao: data.de_descricao,
      urlProjeto: data.url_projeto,
      dtInicio: data.dt_inicio,
      dtFim: data.dt_fim,
    };
  }

  private mapearLink(data: any) {
    return {
      coLink: data.co_link,
      coCandidato: data.co_candidato,
      noTitulo: data.no_titulo,
      urlLink: data.url_link,
    };
  }

  private mapearCandidatura(data: any) {
    return {
      coCandidatura: data.co_candidatura,
    coVaga: data.co_vaga,
    coFuncaoCandidatura: data.co_funcao_candidatura, 
    coCpf: data.co_cpf,
    coStatus: data.co_status,
    dtCriadoEm: data.dt_criado_em,
    };
  }

  async emitirAuditoria(payload: any) {
    try {
      await this.producer.send({
        topic: 'auditoria_acoes_topic',
        messages: [
          {
            value: JSON.stringify(payload),
          },
        ],
      });

      console.log('📤 Auditoria enviada para Kafka');
    } catch (error) {
      console.error('❌ Erro ao enviar auditoria:', error.message);
    }
  }

  async emitirNotificacao(data: {
    registration: string;
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    source: string;
    is_ephemeral?: boolean;
  }) {
    const payload = {
      id: uuidv4(),
      registration: data.registration,
      status: 'UNREAD',
      is_ephemeral: data.is_ephemeral ?? false,
      popup: true,
      source: data.source,
      payload: {
        title: data.title,
        message: data.message,
        priority: data.priority,
        link: '', 
      },
      created_at: new Date().toISOString(),
    };
  
    await this.producer.send({
      topic: 'notifications.events',
      messages: [{ value: JSON.stringify(payload) }],
    });
  }

  async criarConnector(config: ConnectorConfig) {
    return await createDebeziumConnector(config);
  }
}