import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  QueryRunner,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

import { Candidatos } from './candidatos.entity';
import {
  CriarCandidatoDto,
  AtualizarCandidatoDto,
  CriarCandidatoSkillDto,
} from './candidatos.dto';

import { SkillService } from '../skill/skill.service';
import { Experiencia } from '../experiencia/experiencia.entity';
import { Educacao } from '../educacao/educacao.entity';
import { Idioma } from '../idioma/idioma.entity';
import { Certificacao } from '../certificacao/certificacao.entity';
import { CandidatoIdioma } from '../candidato_idioma/candidato_idioma.entity';
import { Projeto } from '../projeto/projeto.entity';
import { Link } from '../link/link.entity';
import { CandidatoSkill } from '../candidato_skill/candidato_skill.entity';
import { paginate } from '../../common/utils/pagination.util'; 
import { IQueryParams } from '../../common/interfaces/query-params.interface';

@Injectable()
export class CandidatosService {
  constructor(
    @InjectRepository(Candidatos)
    private readonly candidatoRepository: Repository<Candidatos>,

    @InjectRepository(CandidatoIdioma)
    private readonly candidatoIdiomaRepository: Repository<CandidatoIdioma>,

    @InjectRepository(Idioma)
    private readonly idiomaRepository: Repository<Idioma>,

    private readonly dataSource: DataSource,
    private readonly skillService: SkillService,
  ) {}

  private readonly relations = [
    'experiencias',
    'educacoes',
    'certificacoes',
    'projetos',
    'links',
    'candidatoSkills',
    'candidatoSkills.skill',
    'candidatoIdiomas',
    'candidatoIdiomas.idioma',
    'funcoesCandidatura',
    'funcoesCandidatura.funcao',
  ];

  // =====================================================
  // GET
  // =====================================================

  async listarCandidatos(query: IQueryParams) {
    const searchFields = ['noCandidato', 'noEmail', 'coCpf', 'headline'];
  
    return paginate<Candidatos>(
      this.candidatoRepository, 
      query, 
      {
        relations: this.relations,
        relationLoadStrategy: 'query',
        order: {
          coCandidato: 'ASC'
        }
      },
      searchFields 
    );
  }

  async obterCandidatoPorCodigo(id: number): Promise<Candidatos> {
    const candidato = await this.candidatoRepository.findOne({
      where: { coCandidato: id },
      relations: this.relations,
      order: {
        experiencias: {
          coExperiencia: 'DESC',
        },
        educacoes: {
          coEducacao: 'DESC',
        },
        certificacoes: {
          coCertificacao: 'DESC',
        },
        projetos: {
          coProjeto: 'DESC',
        },
        links: {
         coLink: 'DESC',
        }
      }
    });

    if (!candidato) {
      throw new HttpException('Candidato não encontrado', HttpStatus.NOT_FOUND);
    }

    return candidato;
  }

  async obterCandidatoPorCPF(cpf: string): Promise<Candidatos> {
    const candidato = await this.candidatoRepository.findOne({
      where: { coCpf: cpf },
      relations: this.relations,
    });

    if (!candidato) {
      throw new HttpException('Candidato não encontrado', HttpStatus.NOT_FOUND);
    }

    return candidato;
  }

  // =====================================================
  // CREATE HTTP
  // =====================================================

  async criarCandidato(dados: CriarCandidatoDto): Promise<Candidatos> {
    const existente = await this.candidatoRepository.findOneBy({
      coCpf: dados.coCpf,
    });

    if (existente) {
      throw new HttpException('CPF já cadastrado', HttpStatus.BAD_REQUEST);
    }

    const skills = await this.processarSkills(dados.candidatoSkills);
    const { idiomas, ...dadosCandidato } = dados;

    const candidato = await this.candidatoRepository.save(
      this.candidatoRepository.create({
        ...dadosCandidato,
        candidatoSkills: skills,
      }),
    );

    if (idiomas?.length) {
      for (const item of idiomas) {
        await this.candidatoIdiomaRepository.save({
          noNivel: item.noNivel,
          candidato: { coCandidato: candidato.coCandidato },
          idioma: { coIdioma: item.coIdioma },
        });
      }
    }

    return this.obterCandidatoPorCodigo(candidato.coCandidato);
  }

  // =====================================================
  // PATCH HTTP
  // =====================================================

  async atualizarCandidato(
    id: number,
    dados: AtualizarCandidatoDto,
  ): Promise<Candidatos> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const candidato = await qr.manager.findOne(Candidatos, {
        where: { coCandidato: id },
        relations: this.relations,
      });

      if (!candidato) {
        throw new HttpException('Candidato não encontrado', HttpStatus.NOT_FOUND);
      }

      if (dados.coCpf && dados.coCpf !== candidato.coCpf) {
        const existente = await qr.manager.findOne(Candidatos, {
          where: { coCpf: dados.coCpf },
        });
        if (existente) {
          throw new HttpException('CPF já em uso', HttpStatus.BAD_REQUEST);
        }
      }

      if (dados.candidatoSkills !== undefined) {
        await qr.manager.delete(CandidatoSkill, {
          candidato: { coCandidato: id },
        });

        const skills = await this.processarSkills(dados.candidatoSkills);
        for (const s of skills ?? []) {
          await qr.manager.save(
            CandidatoSkill,
            qr.manager.create(CandidatoSkill, {
              nuNivel: s.nuNivel,
              candidato: { coCandidato: id },
              skill: { coSkill: s.coSkill },
            }),
          );
        }
      }

      const {
        candidatoSkills,
        idiomas,
        experiencias,
        educacoes,
        certificacoes,
        projetos,
        links,
        ...dadosCandidato
      } = dados;

      qr.manager.merge(Candidatos, candidato, dadosCandidato);
      await qr.manager.save(candidato);

      if (idiomas !== undefined) {
        await qr.manager.delete(CandidatoIdioma, {
          candidato: { coCandidato: id },
        });

        for (const item of idiomas) {
          await qr.manager.save(
            CandidatoIdioma,
            qr.manager.create(CandidatoIdioma, {
              noNivel: item.noNivel,
              candidato: { coCandidato: id },
              idioma: { coIdioma: item.coIdioma },
            }),
          );
        }
      }

      await this.syncCollection(qr, Experiencia, experiencias, id);
      await this.syncCollection(qr, Educacao, educacoes, id);
      await this.syncCollection(qr, Certificacao, certificacoes, id);
      await this.syncCollection(qr, Projeto, projetos, id);
      await this.syncCollection(qr, Link, links, id);

      await qr.commitTransaction();
      return this.obterCandidatoPorCodigo(id);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  // ====================================================
  // DELETE HTTP
  // ====================================================

  async deletarCandidato(id: number): Promise<void> {
    const res = await this.candidatoRepository.delete(id);
    if (!res.affected) {
      throw new HttpException('Candidato não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  // =====================================================
  // KAFKA
  // =====================================================

  async processarMensagemKafka(data: any): Promise<void> {
    const payload = data?.payload?.after ?? data;
    if (!payload) return;

    const cpf = payload.coCpf || payload.co_cpf;
    if (!cpf) return;

    const candidatoExistente = await this.candidatoRepository.findOne({
      where: { coCpf: String(cpf) },
      select: ['coCandidato'],
    });

    if (candidatoExistente) {
      await this.updateKafka(candidatoExistente.coCandidato, payload);
    } else {
      await this.createKafka(payload);
    }
  }

  private sanitizeKafkaCandidato(data: any): Partial<Candidatos> {
    const {
      coCandidato,
      co_candidato,
      dt_criado_em,
      dt_atualizado_em,
      experiencias,
      educacoes,
      certificacoes,
      idiomas,
      projetos,
      links,
      skills,
      candidatoSkills,
      ...rest
    } = data;
  
    return rest;
  }

  async createKafka(data: any): Promise<void> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 1. Extração Inteligente do Payload
      // Tenta pegar o 'after', mas se não existir, assume que 'data' já é o payload
      const payload = data?.payload?.after || data;

      // === RAIO-X DO PAYLOAD (Isso vai aparecer no seu terminal) ===
      console.log('🔍 [DEBUG KAFKA] Chaves disponíveis no payload:', Object.keys(payload));
      
      // 2. Busca Defensiva das Listas (Tenta nomes diferentes)
      const listSkills = payload.skills || payload.candidatoSkills || [];
      const listIdiomas = payload.idiomas || payload.candidatoIdiomas || [];

      console.log(`🔍 [DEBUG KAFKA] Skills encontradas: ${listSkills.length}`);
      // ============================================================

      // 3. Prepara os dados básicos
      const candidatoData = this.sanitizeKafkaCandidato(payload);
      
      // Mapeamento manual de campos snake_case para camelCase
      candidatoData.noCandidato = payload.no_candidato || payload.noCandidato;
      candidatoData.noEmail = payload.no_email || payload.noEmail;
      candidatoData.nuTelefone = payload.nu_telefone || payload.nuTelefone;
      candidatoData.coCpf = String(payload.co_cpf || payload.coCpf);

      // 4. Salva o Candidato
      const candidato = await qr.manager.save(
        qr.manager.create(Candidatos, candidatoData),
      );

      const id = candidato.coCandidato;

      // 5. Processa coleções
      await this.insertKafkaChildren(qr, Experiencia, payload.experiencias, id);
      await this.insertKafkaChildren(qr, Educacao, payload.educacoes, id);
      await this.insertKafkaChildren(qr, Certificacao, payload.certificacoes, id);
      await this.insertKafkaChildren(qr, Projeto, payload.projetos, id);
      await this.insertKafkaChildren(qr, Link, payload.links, id);

      // 6. PROCESSAR SKILLS (Agora passando a lista que capturamos com segurança)
      await this.processarSkillsKafka(listSkills, id, qr);
      
      // 7. Processar Idiomas
      if (listIdiomas.length > 0) {
        const idiomasProc = await this.processarIdiomasKafka(listIdiomas);
        for (const item of idiomasProc) {
          await qr.manager.save(CandidatoIdioma, {
            noNivel: item.no_nivel || item.noNivel,
            candidato: { coCandidato: id },
            idioma: { coIdioma: item.coIdioma },
          });
        }
      }

      await qr.commitTransaction();
      console.log(`✅ [Kafka] Candidato ${id} criado com sucesso.`);
    } catch (e) {
      await qr.rollbackTransaction();
      console.error(`❌ [Kafka] Erro: ${e.message}`);
      // Log extra para ajudar a identificar o erro
      console.error('Objeto que causou erro:', JSON.stringify(data));
      throw e;
    } finally {
      await qr.release();
    }
  }

  
  async updateKafka(id: number, data: any): Promise<void> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const candidatoData = this.sanitizeKafkaCandidato(data);
      if (data.no_candidato) candidatoData.noCandidato = data.no_candidato;

      await qr.manager.update(Candidatos, { coCandidato: id }, candidatoData);

      // Atualiza coleções (Delete + Insert)
      await this.replaceKafkaChildren(qr, Experiencia, data.experiencias, id);
      await this.replaceKafkaChildren(qr, Educacao, data.educacoes, id);
      await this.replaceKafkaChildren(qr, Certificacao, data.certificacoes, id);
      await this.replaceKafkaChildren(qr, Projeto, data.projetos, id);
      await this.replaceKafkaChildren(qr, Link, data.links, id);

      // Skills
      await this.processarSkillsKafka(data.skills || data.candidatoSkills, id, qr);

      // Idiomas
      const idiomasProc = await this.processarIdiomasKafka(data.idiomas || data.candidatoIdiomas);
      await qr.manager.delete(CandidatoIdioma, { candidato: { coCandidato: id } });
      for (const item of idiomasProc) {
        await qr.manager.save(CandidatoIdioma, {
          noNivel: item.noNivel,
          candidato: { coCandidato: id },
          idioma: { coIdioma: item.coIdioma },
        });
      }

      await qr.commitTransaction();
      console.log(`✅ [Kafka] Candidato atualizado: ${id}`);
    } catch (e) {
      await qr.rollbackTransaction();
      console.error(`❌ [Kafka] Erro ao atualizar: ${e.message}`);
      throw e;
    } finally {
      await qr.release();
    }
  }
  

  // =====================================================
  // HELPERS
  // =====================================================

  private async processarSkills(
    skills: CriarCandidatoSkillDto[] | undefined,
  ): Promise<{ coSkill: number; nuNivel: number }[] | undefined> {
    if (!Array.isArray(skills)) return undefined;

    return Promise.all(
      skills.map(async (dto) => {
        const skill = await this.skillService.findOrCreateSkill(dto.noSkill);
        return { coSkill: skill.coSkill, nuNivel: dto.nuNivel ?? 0 };
      }),
    );
  }

  private async processarIdiomasKafka(idiomas: any[] | undefined): Promise<any[]> {
    if (!Array.isArray(idiomas)) return [];

    return Promise.all(
      idiomas.map(async (item) => {
        const nome = item.no_idioma ?? item.noIdioma;
        const nivel = item.no_nivel ?? item.noNivel;
        if (!nome) return null;

        let idioma = await this.idiomaRepository.findOneBy({ noIdioma: nome });
        if (!idioma) {
          idioma = await this.idiomaRepository.save(
            this.idiomaRepository.create({ noIdioma: nome }),
          );
        }

        return { coIdioma: idioma.coIdioma, noNivel: nivel };
      }),
    ).then((r) => r.filter(Boolean));
  }

  private async syncCollection(
    qr: QueryRunner,
    Entity: EntityTarget<ObjectLiteral>,
    payload: any[] | undefined,
    candidatoId: number,
  ): Promise<void> {
    if (!Array.isArray(payload)) return;

    await qr.manager.delete(Entity, { coCandidato: candidatoId } as any);

    for (const item of payload) {
      const { coCandidato, co_candidato, ...data } = item;
      await qr.manager.save(
        Entity,
        qr.manager.create(Entity, {
          ...data,
          coCandidato: candidatoId,
        }),
      );
    }
  }

  private async insertKafkaChildren(
    qr: QueryRunner,
    Entity: EntityTarget<ObjectLiteral>,
    payload: any[] | undefined,
    candidatoId: number,
  ): Promise<void> {
    if (!Array.isArray(payload)) return;

    for (const item of payload) {
      const { coCandidato, co_candidato, ...data } = item;
      await qr.manager.save(
        Entity,
        qr.manager.create(Entity, {
          ...data,
          coCandidato: candidatoId,
        }),
      );
    }
  }

  private async replaceKafkaChildren(
    qr: QueryRunner,
    Entity: EntityTarget<ObjectLiteral>,
    payload: any[] | undefined,
    candidatoId: number,
  ): Promise<void> {
    if (!Array.isArray(payload)) return;

    await qr.manager.delete(Entity, { coCandidato: candidatoId } as any);
    await this.insertKafkaChildren(qr, Entity, payload, candidatoId);
  }

  private async processarSkillsKafka(
    skills: any[], 
    candidatoId: number, 
    qr: QueryRunner
  ): Promise<void> {
    // 1. Validação de entrada
    if (!Array.isArray(skills) || skills.length === 0) {
      console.log(`[Kafka Debug] Nenhuma skill encontrada para processar no candidato ${candidatoId}`);
      return;
    }
  
    console.log(`[Kafka Debug] Processando ${skills.length} skills para o candidato ${candidatoId}`);

    // 2. Limpa os vínculos atuais
    await qr.manager.delete(CandidatoSkill, { coCandidato: candidatoId });
  
    for (const item of skills) {
      // 3. Captura o nome (snake_case do Debezium ou camelCase)
      const nomeSkill = item.no_skill || item.noSkill;
      
      if (!nomeSkill) {
        console.log(`[Kafka Debug] Skill ignorada por falta de nome:`, item);
        continue;
      }
  
      // 4. Busca ou Cria a Skill (Retorna a entidade Skill completa)
      const skillEntity = await this.skillService.findOrCreateSkill(nomeSkill);
      const nivel = item.nu_nivel || item.nuNivel || 0;
  
      // 5. CRIAÇÃO ROBUSTA DO VÍNCULO
      // Preenchemos tanto a Coluna ID quanto a Relação para evitar ambiguidades do TypeORM
      const novoVinculo = qr.manager.create(CandidatoSkill, {
        nuNivel: nivel,
        coCandidato: candidatoId,           // Preenche a coluna @Column
        candidato: { coCandidato: candidatoId } as any, // Preenche a relação @ManyToOne
        coSkill: skillEntity.coSkill,       // Preenche a coluna @Column
        skill: skillEntity                  // Preenche a relação @ManyToOne
      });
  
      await qr.manager.save(CandidatoSkill, novoVinculo);
      console.log(`[Kafka Debug] Skill vinculada: ${nomeSkill} (ID: ${skillEntity.coSkill}) ao Candidato ${candidatoId}`);
    }
  }

  async delete(id: number): Promise<void> {
    await this.candidatoRepository.delete(id);
    console.log(`🗑️ [Kafka] Candidato ${id} deletado`);
  }
}
