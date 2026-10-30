import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import {
  PaginatedResult,
  PaginationMeta,
  PaginationQuery,
  QueryOptions,
  SortOrder,
} from "../interfaces/query.interface.ts";
import { ApiError } from "../utils/api-error.ts";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_ORDER: SortOrder = "DESC";
const DEFAULT_SORT_BY = "createdAt";
const MIN_PREFIX = "min";
const MAX_PREFIX = "max";
const RESERVED_QUERY_KEYS = new Set([
  "page",
  "limit",
  "search",
  "sortBy",
  "order",
]);

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/**
 * Checks a user-provided value against a developer-provided allowlist.
 * Runtime check only; the allowlist is what prevents arbitrary column
 * names from reaching SQL.
 */
const isInAllowlist = (
  allowlist: readonly string[] | undefined,
  value: string
): boolean => allowlist?.includes(value) ?? false;

const toPositiveInteger = (value: unknown, fallback: number): number => {
  const parsed =
    typeof value === "number" ? value : Number(toTrimmedString(value) ?? "");
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
};

/**
 * Normalizes a raw query value into filter values.
 * Supports repeated params (`?status=A&status=B`) and
 * comma-separated values (`status=A,B`) for IN filtering.
 */
const toFilterValues = (value: unknown): Array<string | number | boolean> => {
  const source = Array.isArray(value) ? value : [value];
  const values: Array<string | number | boolean> = [];

  for (const item of source) {
    if (typeof item === "string") {
      for (const part of item.split(",")) {
        const trimmed = part.trim();
        if (trimmed !== "") {
          values.push(trimmed);
        }
      }
    } else if (typeof item === "number" && Number.isFinite(item)) {
      values.push(item);
    } else if (typeof item === "boolean") {
      values.push(item);
    }
  }

  return values;
};

/**
 * Normalizes a raw query value into a numeric or date value for
 * `min<Field>` / `max<Field>` range filtering. Invalid values are dropped.
 */
const toRangeValue = (
  value: unknown
): string | number | Date | undefined => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  if (!Number.isNaN(Number(trimmed))) {
    return Number(trimmed);
  }
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

/**
 * Generic service that applies pagination, sorting, searching and
 * (advanced) filtering to an existing TypeORM SelectQueryBuilder.
 *
 * It never replaces conditions already applied to the query builder:
 * all conditions are added with `andWhere`. Column names come only
 * from the developer-provided allowlists in `QueryOptions`, and all
 * user-provided values are parameterized.
 */
export class PaginationService {
  static async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: PaginationQuery,
    options: QueryOptions<T>
  ): Promise<PaginatedResult<T>> {
    try {
      if (!options.alias) {
        throw new ApiError(500, "Pagination alias is required");
      }

      const { page, limit } = this.resolvePagination(query, options);

      this.applySearch(queryBuilder, query, options);
      this.applyFilters(queryBuilder, query, options);
      this.applySorting(queryBuilder, query, options);

      queryBuilder.skip((page - 1) * limit).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      const pagination: PaginationMeta = {
        total,
        itemCount: data.length,
        limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };

      return { data, pagination };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to fetch paginated results"
        );
      }
      throw new ApiError(500, "Failed to fetch paginated results");
    }
  }

  /**
   * Resolves page and limit. Invalid, negative or non-numeric values
   * fall back to defaults. Limit is clamped to the configured maximum
   * (never above 100).
   */
  private static resolvePagination<T extends ObjectLiteral>(
    query: PaginationQuery,
    options: QueryOptions<T>
  ): { page: number; limit: number } {
    const page = toPositiveInteger(query.page, DEFAULT_PAGE);
    const requestedLimit = toPositiveInteger(
      query.limit,
      options.defaultLimit ?? DEFAULT_LIMIT
    );
    const maxLimit = Math.min(
      Math.max(options.maxLimit ?? MAX_LIMIT, 1),
      MAX_LIMIT
    );
    const limit = Math.min(requestedLimit, maxLimit);

    return { page, limit };
  }

  /**
   * Applies case-insensitive partial matching across the configured
   * searchable fields. MySQL's default collation is case-insensitive,
   * matching the existing LIKE usage in TransactionService.
   */
  private static applySearch<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: PaginationQuery,
    options: QueryOptions<T>
  ): void {
    const fields = options.searchableFields;
    const term = toTrimmedString(query.search);

    if (!term || !fields?.length) {
      return;
    }

    const conditions = fields.map(
      (field) => `${options.alias}.${field} LIKE :searchTerm`
    );

    queryBuilder.andWhere(`(${conditions.join(" OR ")})`, {
      searchTerm: `%${term}%`,
    });
  }

  /**
   * Applies exact-match / IN filtering for `filterableFields` and
   * `min<Field>` / `max<Field>` range filtering for `rangeFields`.
   * Empty and undefined values are ignored.
   */
  private static applyFilters<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: PaginationQuery,
    options: QueryOptions<T>
  ): void {
    const filterableFields = options.filterableFields ?? [];
    const rangeFields = options.rangeFields ?? [];

    if (!filterableFields.length && !rangeFields.length) {
      return;
    }

    const conditions: string[] = [];
    const params: Record<string, unknown> = {};
    let paramIndex = 0;

    for (const [key, rawValue] of Object.entries(query)) {
      if (RESERVED_QUERY_KEYS.has(key)) {
        continue;
      }

      if (isInAllowlist(filterableFields, key)) {
        const values = toFilterValues(rawValue);
        if (!values.length) {
          continue;
        }
        const paramName = `filter_${paramIndex++}`;
        if (values.length === 1) {
          conditions.push(`${options.alias}.${key} = :${paramName}`);
          params[paramName] = values[0];
        } else {
          conditions.push(`${options.alias}.${key} IN (:...${paramName})`);
          params[paramName] = values;
        }
        continue;
      }

      const range = this.parseRangeKey(key, rangeFields);
      if (!range) {
        continue;
      }
      const rangeValue = toRangeValue(rawValue);
      if (rangeValue === undefined) {
        continue;
      }
      const paramName = `filter_${paramIndex++}`;
      conditions.push(
        `${options.alias}.${range.field} ${range.operator} :${paramName}`
      );
      params[paramName] = rangeValue;
    }

    if (conditions.length) {
      queryBuilder.andWhere(conditions.join(" AND "), params);
    }
  }

  /**
   * Recognizes `min<Field>` / `max<Field>` query keys against the
   * configured rangeFields allowlist.
   */
  private static parseRangeKey<T extends ObjectLiteral>(
    key: string,
    rangeFields: readonly Extract<keyof T, string>[]
  ): { field: string; operator: string } | undefined {
    const prefixes: Array<[string, string]> = [
      [MIN_PREFIX, ">="],
      [MAX_PREFIX, "<="],
    ];

    for (const [prefix, operator] of prefixes) {
      if (!key.startsWith(prefix) || key.length <= prefix.length) {
        continue;
      }
      const field =
        key.charAt(prefix.length).toLowerCase() + key.slice(prefix.length + 1);
      if (isInAllowlist(rangeFields, field)) {
        return { field, operator };
      }
    }

    return undefined;
  }

  /**
   * Applies ordering. `sortBy` is only honored when it appears in the
   * sortableFields allowlist; otherwise the configured default is used.
   * Defaults to createdAt DESC, matching existing behavior.
   */
  private static applySorting<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: PaginationQuery,
    options: QueryOptions<T>
  ): void {
    const sortableFields = options.sortableFields;
    const requested = toTrimmedString(query.sortBy);

    let sortBy: string;
    if (requested && isInAllowlist(sortableFields, requested)) {
      sortBy = requested;
    } else if (options.defaultSortBy) {
      sortBy = options.defaultSortBy;
    } else if (isInAllowlist(sortableFields, DEFAULT_SORT_BY)) {
      sortBy = DEFAULT_SORT_BY;
    } else if (sortableFields?.length) {
      sortBy = sortableFields[0] as string;
    } else {
      sortBy = DEFAULT_SORT_BY;
    }

    const order: SortOrder =
      toTrimmedString(query.order)?.toUpperCase() === "ASC"
        ? "ASC"
        : (options.defaultOrder ?? DEFAULT_ORDER);

    queryBuilder.orderBy(`${options.alias}.${sortBy}`, order);
  }
}
