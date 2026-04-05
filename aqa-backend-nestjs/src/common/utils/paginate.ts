import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationArgs } from '../args/pagination.arg';
import { PaginatedMetaData } from '../dto/PaginatedMeta';
import { FilterArgs } from '../args/filter.arg';

type PaginatedData<T> = Promise<{ data: T[]; meta: PaginatedMetaData }>;

export async function paginate<T>(
  repo: Repository<T>,
  paginationOptions: PaginationArgs,
  options: FindManyOptions<T>,
): PaginatedData<T> {
  const [data, count] = await repo.findAndCount({
    take: paginationOptions.size,
    skip: paginationOptions.page * paginationOptions.size,
    ...options,
  });

  return { data, meta: new PaginatedMetaData(paginationOptions, count) };
}

export async function paginateByQuery<T>(
  query: SelectQueryBuilder<T>,
  paginationOptions: PaginationArgs,
  filter: FilterArgs,
  options?: FindManyOptions<T> & { isRaw?: boolean },
): PaginatedData<T> {
  const querySql = query
    .setFindOptions(options)
    .setParameters(filter)
    .take(paginationOptions.size)
    .skip(paginationOptions.page * paginationOptions.size);

  console.log({ sql: querySql.getSql() });

  if (!options.isRaw) {
    const [data, count] = await querySql.getManyAndCount();
    return { data, meta: new PaginatedMetaData(paginationOptions, count) };
  } else {
    // Optimization: avoid fetching all results to get count.
    // We use a subquery to count the total number of groups correctly.
    const subQuery = querySql
      .clone()
      .offset(undefined)
      .limit(undefined)
      .take(undefined)
      .skip(undefined)
      .setFindOptions({})
      .select('1');
    const [sql, params] = subQuery.getQueryAndParameters();
    const totalRes = await querySql.connection.query(
      `SELECT COUNT(*) AS count FROM (${sql}) AS subquery`,
      params,
    );
    const count = parseInt(totalRes[0].count, 10);

    const data = await querySql
      .limit(paginationOptions.size)
      .offset(paginationOptions.page * paginationOptions.size)
      .getRawMany();
    return { data, meta: new PaginatedMetaData(paginationOptions, count) };
  }
}
