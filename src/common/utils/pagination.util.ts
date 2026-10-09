/**
 * Função de Paginação Genérica para TypeORM
 * - Suporta filtros dinâmicos, busca global (ILIKE), ordenação e relações
 * - Filtros de Data: Campos que começam com 'dt' são tratados como datas e filtrados por intervalo do dia inteiro
 * - Busca Global: Permite busca em múltiplos campos usando ILIKE (case-insensitive)
 * - Ordenação: Permite ordenação dinâmica com base em opções fornecidas
 * 
 * - Exemplo de Uso:
 *    const resultado = await paginate(this.vagasRepository, query, {
 *      relations: ['funcao', 'nivel'],
 *      order: { coVaga: 'ASC' },
 *      searchFields: ['noVaga', 'deVaga', 'funcao.noFuncao', 'nivel.noNivel'],   
 *    });
 * 
 *  - O resultado retornará um objeto com os dados paginados e metadados (total, página atual, última página, limite)
 *  - Observação: Certifique-se de que os campos de data estejam no formato 'YYYY-MM-DD' para que o filtro funcione corretamente.
 * 
 *  - Exemplo de Filtro de Data:
 *     GET /vagas?dtCriacao=2024-02-15
 *  
 *  - Exemplo de Busca Global:
 *     GET /vagas?search=desenvolvedor
 * 
 * - Exemplo de Ordenação:
 *    GET /vagas?order[coVaga]=DESC
 * 
 * - Exemplo Completo:
 *    GET /vagas?search=desenvolvedor&dtCriacao=2024-02-15&order[coVaga]=DESC&page=2&limit=5
 * 
 * @author 129891 - Renato Vinicius
 * @date fevereiro 2026
 */
import { Repository, ObjectLiteral, Brackets } from 'typeorm';
import { IQueryParams } from '../interfaces/query-params.interface';

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  query: IQueryParams,
  baseOptions: any = {},
  searchFields: string[] = [],
) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const queryBuilder = repository.createQueryBuilder('entity');
  const dynamicOrder: Record<string, 'ASC' | 'DESC'> = {};
  const filters: Record<string, any> = {};
  let search: string | undefined;

  Object.keys(query).forEach((key) => {

    const value = query[key];

    if (key === 'search') {
      search = value as string;
      return;
    }

    if (key === 'page' || key === 'limit') {
      return;
    }

    const orderMatch = key.match(/^order\[(.+)\]$/);

    if (orderMatch) {
      const column = orderMatch[1];
      dynamicOrder[column] =
        String(value).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else {
      filters[key] = value;
    }

  });

  // 1. Aplicar Relações
  if (baseOptions.relations) {
    baseOptions.relations.forEach((rel: string) => {
      const parts = rel.split('.');
      if (parts.length === 1) {
        queryBuilder.leftJoinAndSelect(`entity.${rel}`, rel);
      } else {
        const alias = rel.replace(/\./g, '_');
        const parentAlias = parts.slice(0, -1).join('_') || 'entity';
        const property = parts[parts.length - 1];
        queryBuilder.leftJoinAndSelect(`${parentAlias}.${property}`, alias);
      }
    });
  }

  // 2. Filtros Dinâmicos
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {

      if (key.startsWith('dt') && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {

        const dateStr = String(value);
        const startDate = new Date(`${dateStr}T00:00:00.000Z`);
        const endDate = new Date(`${dateStr}T23:59:59.999Z`);

        queryBuilder.andWhere(
          `entity.${key} >= :start_${key} AND entity.${key} <= :end_${key}`,
          {
            [`start_${key}`]: startDate,
            [`end_${key}`]: endDate,
          },
        );
      } else if (key.startsWith('co') || key.startsWith('ic')) {

        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      } else {
        queryBuilder.andWhere(`entity.${key} ILIKE :${key}`, {
          [key]: `%${value}%`,
        });

      }
    }
  });

  // 3. Busca Global (ILIKE)
  if (search && String(search).trim() !== '' && searchFields.length > 0) {
    queryBuilder.andWhere(
      new Brackets((qb) => {
        searchFields.forEach((field, index) => {
          const parts = field.split('.');
          let alias = 'entity';
          let column = parts[0];

          if (parts.length > 1) {
            alias = parts.slice(0, -1).join('_');
            column = parts[parts.length - 1];
          }

          const condition = `${alias}.${column}`;
          const operator = index === 0 ? 'where' : 'orWhere';

          qb[operator](`${condition} ILIKE :searchTerm`, {
            searchTerm: `%${search}%`,
          });
        });
      }),
    );
  }

  // 4. Ordenação
  if (Object.keys(dynamicOrder).length > 0) {

    Object.keys(dynamicOrder).forEach((key) => {

      const direction = dynamicOrder[key];
      const parts = key.split('.');

      let alias = 'entity';
      let column = parts[0];

      if (parts.length > 1) {
        alias = parts.slice(0, -1).join('_');
        column = parts[parts.length - 1];

        const aliasExists = queryBuilder.expressionMap.aliases.some(
          (a) => a.name === alias,
        );

        if (!aliasExists) {
          return;
        }

        queryBuilder.addOrderBy(`${alias}.${column}`, direction);
      } else {

        const columnExists =
          repository.metadata.findColumnWithPropertyName(column);

        if (!columnExists) {
          return;
        }

        queryBuilder.addOrderBy(`entity.${column}`, direction);
      }

    });

  } else if (baseOptions.order) {

    Object.keys(baseOptions.order).forEach((key) => {

      const columnExists =
        repository.metadata.findColumnWithPropertyName(key);

      if (!columnExists) {
        return;
      }

      queryBuilder.addOrderBy(
        `entity.${key}`,
        baseOptions.order[key],
      );
    });
  }

  const [data, total] = await queryBuilder
    .take(limit)
    .skip(skip)
    .getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
}